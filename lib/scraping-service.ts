/**
 * Web Scraping Service - Extract product metadata from URLs
 * 
 * Fetches product pages and extracts title, price, images, and description
 * from Open Graph tags, JSON-LD, or page content.
 */

import { load } from 'cheerio';

export interface ProductMetadata {
    title: string;
    description: string;
    price: string;
    currency: string;
    images: string[];
    url: string;
}

export interface ScrapingResult {
    success: boolean;
    data?: ProductMetadata;
    error?: string;
}

/**
 * Extract product metadata from URL
 * @param url Product page URL
 * @returns Extracted product data or error
 */
export async function extractProductFromURL(url: string): Promise<ScrapingResult> {
    try {
        // Validate URL
        const validUrl = new URL(url);

        // Fetch the page HTML
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; WishHive/1.0)',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        const $ = load(html);

        // Extract data using multiple strategies
        const openGraphData = extractOpenGraph($);
        const jsonLdData = extractJSONLD($);
        const fallbackData = extractFallback($);

        // Merge data with priority: JSON-LD > Open Graph > Fallback
        const metadata: ProductMetadata = {
            title: jsonLdData.title || openGraphData.title || fallbackData.title || 'Product',
            description: jsonLdData.description || openGraphData.description || fallbackData.description || '',
            price: jsonLdData.price || openGraphData.price || fallbackData.price || '',
            currency: jsonLdData.currency || openGraphData.currency || 'USD',
            images: [
                ...(jsonLdData.images || []),
                ...(openGraphData.images || []),
                ...(fallbackData.images || []),
            ].filter((img, index, self) => self.indexOf(img) === index).slice(0, 5), // Unique, max 5
            url: validUrl.href,
        };

        // Validate we got at least a title
        if (!metadata.title || metadata.title === 'Product') {
            throw new Error('Could not extract product title from page');
        }

        return {
            success: true,
            data: metadata,
        };
    } catch (error) {
        console.error('Product extraction failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to extract product data',
        };
    }
}

/**
 * Extract data from Open Graph meta tags
 */
function extractOpenGraph($: any): Partial<ProductMetadata> {
    const title = $('meta[property="og:title"]').attr('content');
    const description = $('meta[property="og:description"]').attr('content');
    const image = $('meta[property="og:image"]').attr('content');
    const priceAmount = $('meta[property="product:price:amount"]').attr('content');
    const priceCurrency = $('meta[property="product:price:currency"]').attr('content');

    return {
        title,
        description,
        price: priceAmount,
        currency: priceCurrency,
        images: image ? [image] : [],
    };
}

/**
 * Extract data from JSON-LD structured data
 */
function extractJSONLD($: any): Partial<ProductMetadata> {
    const scripts = $('script[type="application/ld+json"]');

    for (let i = 0; i < scripts.length; i++) {
        try {
            const jsonText = $(scripts[i]).html();
            if (!jsonText) continue;

            const data = JSON.parse(jsonText);

            // Check if it's a Product schema
            if (data['@type'] === 'Product' || data['@type']?.includes('Product')) {
                return {
                    title: data.name,
                    description: data.description,
                    price: data.offers?.price || data.offers?.lowPrice,
                    currency: data.offers?.priceCurrency,
                    images: Array.isArray(data.image)
                        ? data.image
                        : data.image
                            ? [data.image]
                            : [],
                };
            }
        } catch (error) {
            // Skip invalid JSON
            continue;
        }
    }

    return {};
}

/**
 * Fallback extraction from common HTML patterns
 */
function extractFallback($: any): Partial<ProductMetadata> {
    // Try common selectors
    const title =
        $('h1.product-title').text().trim() ||
        $('h1[itemprop="name"]').text().trim() ||
        $('h1').first().text().trim();

    const description =
        $('[itemprop="description"]').text().trim() ||
        $('meta[name="description"]').attr('content');

    // Price patterns
    const priceSelectors = [
        '.price',
        '[itemprop="price"]',
        '.product-price',
        '.sale-price',
        '.current-price',
    ];

    let price = '';
    for (const selector of priceSelectors) {
        const priceText = $(selector).first().text().trim();
        if (priceText) {
            price = priceText.replace(/[^0-9.,]/g, '');
            break;
        }
    }

    // Images
    const images: string[] = [];
    $('img[itemprop="image"]').each((i: number, el: any) => {
        const src = $(el).attr('src') || $(el).attr('data-src');
        if (src) images.push(src);
    });

    // If no images found, try product gallery
    if (images.length === 0) {
        $('.product-image img, .gallery img').each((i: number, el: any) => {
            const src = $(el).attr('src') || $(el).attr('data-src');
            if (src && !src.includes('placeholder')) images.push(src);
        });
    }

    return {
        title,
        description,
        price,
        images,
    };
}

/**
 * Validate if a URL is scrapable
 * @param url URL to check
 * @returns true if URL is valid and not blocked
 */
export function isScrapableURL(url: string): boolean {
    try {
        const parsedUrl = new URL(url);

        // Block certain domains that prevent scraping
        const blockedDomains = ['facebook.com', 'instagram.com', 'twitter.com'];
        const domain = parsedUrl.hostname.toLowerCase();

        if (blockedDomains.some(blocked => domain.includes(blocked))) {
            return false;
        }

        // Must be http or https
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}
