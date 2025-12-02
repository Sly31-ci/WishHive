/**
 * QR Service - Generate and validate QR codes
 * 
 * Handles QR code generation for wishlist sharing and
 * seller POS verification codes.
 */

export interface WishlistQRData {
    type: 'wishlist';
    id: string;
    accessCode?: string;
}

export interface VerificationQRData {
    type: 'verification';
    code: string;
    orderId: string;
    sellerId: string;
    expiresAt: string;
}

export type QRData = WishlistQRData | VerificationQRData;

/**
 * Generate QR code data for wishlist sharing
 * @param wishlistId Wishlist UUID
 * @param accessCode Optional access code for private wishlists
 * @returns Encoded QR data string
 */
export function generateWishlistQRData(
    wishlistId: string,
    accessCode?: string
): string {
    const data: WishlistQRData = {
        type: 'wishlist',
        id: wishlistId,
        ...(accessCode && { accessCode }),
    };

    // Create deep link URL
    const baseUrl = 'wishhive://';
    const params = new URLSearchParams({
        type: 'wishlist',
        id: wishlistId,
        ...(accessCode && { code: accessCode }),
    });

    return `${baseUrl}open?${params.toString()}`;
}

/**
 * Generate one-time verification QR code for sellers
 * @param orderId Order UUID
 * @param sellerId Seller UUID
 * @param validityMinutes How long the code is valid (default 30 min)
 * @returns Encoded QR data string
 */
export function generateVerificationQRData(
    orderId: string,
    sellerId: string,
    validityMinutes: number = 30
): string {
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000).toISOString();

    const data: VerificationQRData = {
        type: 'verification',
        code,
        orderId,
        sellerId,
        expiresAt,
    };

    // Create deep link URL
    const baseUrl = 'wishhive://';
    const params = new URLSearchParams({
        type: 'verification',
        code,
        orderId,
        sellerId,
        expires: expiresAt,
    });

    return `${baseUrl}verify?${params.toString()}`;
}

/**
 * Parse QR code data from scanned URL
 * @param qrUrl Scanned QR code URL
 * @returns Parsed QR data object or null if invalid
 */
export function parseQRData(qrUrl: string): QRData | null {
    try {
        const url = new URL(qrUrl);

        // Check if it's a WishHive deep link
        if (!qrUrl.startsWith('wishhive://')) {
            return null;
        }

        const params = new URLSearchParams(url.search);
        const type = params.get('type');

        if (type === 'wishlist') {
            const id = params.get('id');
            const accessCode = params.get('code') || undefined;

            if (!id) return null;

            return {
                type: 'wishlist',
                id,
                accessCode,
            };
        }

        if (type === 'verification') {
            const code = params.get('code');
            const orderId = params.get('orderId');
            const sellerId = params.get('sellerId');
            const expiresAt = params.get('expires');

            if (!code || !orderId || !sellerId || !expiresAt) {
                return null;
            }

            return {
                type: 'verification',
                code,
                orderId,
                sellerId,
                expiresAt,
            };
        }

        return null;
    } catch (error) {
        console.error('Failed to parse QR data:', error);
        return null;
    }
}

/**
 * Validate verification QR code
 * @param data Verification QR data
 * @returns true if code is valid and not expired
 */
export function isVerificationCodeValid(data: VerificationQRData): boolean {
    const now = new Date();
    const expiresAt = new Date(data.expiresAt);

    return now < expiresAt;
}

/**
 * Generate random verification code (8 alphanumeric characters)
 */
function generateVerificationCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars
    let code = '';

    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return code;
}

/**
 * Create shareable URL for wishlist (web fallback)
 * @param wishlistId Wishlist UUID
 * @param accessCode Optional access code
 * @returns Web URL that redirects to app or web version
 */
export function createShareableWishlistURL(
    wishlistId: string,
    accessCode?: string
): string {
    const baseUrl = 'https://wishhive.app/wishlist'; // Replace with actual domain
    const params = new URLSearchParams({
        id: wishlistId,
        ...(accessCode && { code: accessCode }),
    });

    return `${baseUrl}?${params.toString()}`;
}
