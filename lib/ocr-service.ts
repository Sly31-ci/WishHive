/**
 * OCR Service - Extract text from receipt images
 * 
 * Uses Tesseract.js for client-side OCR to extract merchant name,
 * amount, and date from purchase receipts for verification purposes.
 */

import { createWorker } from 'tesseract.js';

export interface OCRResult {
    merchantName: string;
    amount: string;
    date: string;
    rawText: string;
    confidence: number;
}

export interface OCRExtractionResult {
    success: boolean;
    data?: OCRResult;
    error?: string;
}

/**
 * Extract structured data from receipt image
 * @param imageUri Local URI to the receipt image
 * @returns Extracted merchant, amount, date and confidence score
 */
export async function extractReceiptData(imageUri: string): Promise<OCRExtractionResult> {
    try {
        // Create Tesseract worker
        const worker = await createWorker('eng');

        // Perform OCR
        const { data: { text, confidence } } = await worker.recognize(imageUri);

        // Clean up worker
        await worker.terminate();

        // Parse extracted text
        const parsed = parseReceiptText(text);

        return {
            success: true,
            data: {
                ...parsed,
                rawText: text,
                confidence: confidence / 100, // Convert 0-100 to 0-1
            },
        };
    } catch (error) {
        console.error('OCR extraction failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'OCR failed',
        };
    }
}

/**
 * Parse raw OCR text to extract merchant, amount, and date
 * Uses regex patterns to identify common receipt formats
 */
function parseReceiptText(text: string): Omit<OCRResult, 'rawText' | 'confidence'> {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

    let merchantName = '';
    let amount = '';
    let date = '';

    // Extract merchant name (usually first non-empty line or contains "LLC", "Inc", etc)
    const merchantPattern = /(LLC|Inc|Ltd|Corp|Store|Market|Shop)/i;
    const merchantLine = lines.find(line => merchantPattern.test(line)) || lines[0];
    merchantName = merchantLine?.replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'Unknown';

    // Extract amount (look for currency symbols and decimal numbers)
    const amountPattern = /[\$€£¥]?\s*(\d{1,6}(?:[.,]\d{2}))/;
    for (const line of lines) {
        const match = line.match(amountPattern);
        if (match) {
            amount = match[1];
            break;
        }
    }

    // Extract date (common formats: MM/DD/YYYY, DD-MM-YYYY, etc)
    const datePattern = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})|(\d{4}[-/]\d{1,2}[-/]\d{1,2})/;
    for (const line of lines) {
        const match = line.match(datePattern);
        if (match) {
            date = match[0];
            break;
        }
    }

    return {
        merchantName: merchantName || 'Not detected',
        amount: amount || 'Not detected',
        date: date || 'Not detected',
    };
}

/**
 * Validate if OCR confidence is acceptable
 * @param confidence OCR confidence score (0-1)
 * @returns true if confidence is above threshold
 */
export function isOCRConfident(confidence: number): boolean {
    const CONFIDENCE_THRESHOLD = 0.6; // 60%
    return confidence >= CONFIDENCE_THRESHOLD;
}

/**
 * Check if OCR data requires admin review
 * Based on confidence score and data completeness
 */
export function requiresAdminReview(result: OCRResult): boolean {
    // Low confidence
    if (result.confidence < 0.6) return true;

    // Missing critical data
    if (
        result.merchantName === 'Not detected' ||
        result.amount === 'Not detected'
    ) {
        return true;
    }

    return false;
}
