export interface ScrapedMetadata {
    title?: string;
    description?: string;
    image?: string;
    price?: number;
    currency?: string;
    url: string;
}

export interface ScrapingResult {
    success: boolean;
    data?: ScrapedMetadata;
    error?: string;
}

/**
 * Extract metadata from a URL using client-side fetching and Regex parsing.
 * Note: limits apply due to CORS and mobile network restrictions.
 */
export async function extractMetadata(url: string): Promise<ScrapingResult> {
    try {
        // Basic URL validation
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }

        // Fetch HTML content
        const response = await fetch(url, {
            headers: {
                // Emulate a standard browser to avoid some bot detection
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();

        // Helper to extract content from meta tags
        const getMetaContent = (property: string, attrName: 'name' | 'property' = 'property') => {
            const regex = new RegExp(`<meta[^>]*${attrName}=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
            const match = html.match(regex);
            return match ? match[1] : null;
        };

        // Helper to find content by ID (simple approximation)
        const getById = (id: string) => {
            const regex = new RegExp(`id=["']${id}["'][^>]*>(.*?)<`, 'is');
            const match = html.match(regex);
            return match ? match[1].trim() : null;
        };

        // Helper to find first tag content
        const getTagContent = (tagName: string) => {
            const regex = new RegExp(`<${tagName}[^>]*>(.*?)<\/${tagName}>`, 'is');
            const match = html.match(regex);
            return match ? match[1].trim() : null;
        };

        // Extract Metadata
        const title =
            getMetaContent('og:title') ||
            getMetaContent('twitter:title', 'name') ||
            getById('productTitle') || // Amazon
            getTagContent('h1') ||
            getTagContent('title') ||
            '';

        const description =
            getMetaContent('og:description') ||
            getMetaContent('twitter:description', 'name') ||
            getMetaContent('description', 'name') ||
            getById('productDescription') || // Generic e-commerce
            '';

        const image =
            getMetaContent('og:image') ||
            getMetaContent('twitter:image', 'name') ||
            (() => {
                const match = html.match(/<link[^>]*rel=["']image_src["'][^>]*href=["']([^"']*)["']/i);
                return match ? match[1] : null;
            })() ||
            // Amazon simple check - logic simplified from cheerio version as regex for complex nested selectors is fragile
            null ||
            '';

        // Attempt to extract price
        // 1. Try OpenGraph price
        let priceStr = getMetaContent('product:price:amount') ||
            getMetaContent('og:price:amount');

        let currency = getMetaContent('product:price:currency') ||
            getMetaContent('og:price:currency') ||
            'USD';

        // 2. Fallback: Naive price search if needed (skipped for stability as per original)

        // Decode HTML entities if needed (basic version)
        const cleanText = (text: string) => {
            return text
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/\s+/g, ' ')
                .trim();
        };

        const metadata: ScrapedMetadata = {
            title: cleanText(title),
            description: cleanText(description),
            image: image ? cleanText(image) : undefined,
            price: priceStr ? parseFloat(priceStr) : undefined,
            currency: cleanText(currency),
            url
        };

        return {
            success: true,
            data: metadata
        };

    } catch (error) {
        console.error('Scraping error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error during scraping'
        };
    }
}
