import { Share, Platform } from 'react-native';

export interface ShareWishlistOptions {
    wishlistId: string;
    title: string;
    description?: string;
    accessCode?: string;
}

/**
 * Generate shareable link for a wishlist
 */
export function generateWishlistLink(wishlistId: string, accessCode?: string): string {
    const baseUrl = 'https://wishhive.app'; // Replace with actual domain
    let url = `${baseUrl}/wishlist/${wishlistId}`;

    if (accessCode) {
        url += `?code=${accessCode}`;
    }

    return url;
}

/**
 * Share a wishlist via native share dialog
 */
export async function shareWishlist(options: ShareWishlistOptions): Promise<boolean> {
    try {
        const url = generateWishlistLink(options.wishlistId, options.accessCode);
        const message = options.description
            ? `${options.title}\n\n${options.description}\n\n${url}`
            : `${options.title}\n\n${url}`;

        const result = await Share.share({
            message,
            url: Platform.OS === 'ios' ? url : undefined,
            title: options.title,
        });

        return result.action === Share.sharedAction;
    } catch (error) {
        console.error('Error sharing wishlist:', error);
        return false;
    }
}

/**
 * Copy wishlist link to clipboard
 */
export function copyWishlistLink(wishlistId: string, accessCode?: string): string {
    return generateWishlistLink(wishlistId, accessCode);
}

/**
 * Generate QR code data for wishlist
 */
export function generateQRData(wishlistId: string, accessCode?: string): string {
    return generateWishlistLink(wishlistId, accessCode);
}
