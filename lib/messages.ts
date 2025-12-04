/**
 * Fun and creative success messages for WishHive
 * Randomly selected to keep the experience fresh and exciting
 */

export const SUCCESS_MESSAGES = {
    ITEM_ADDED: [
        { title: '🎉 Boom!', message: 'Item added to your wishlist!' },
        { title: '✨ Yaaas!', message: 'Your wish just landed!' },
        { title: '🚀 Nailed it!', message: 'One more wish closer to reality!' },
        { title: '🎁 Cha-ching!', message: 'Your wishlist is growing!' },
        { title: '⚡ Zap!', message: 'Instant wish added!' },
        { title: '🌟 Star power!', message: 'Wish successfully saved!' },
        { title: '🎊 Woohoo!', message: 'Your wish is now on the list!' },
        { title: '🔥 Fire!', message: 'Your wishlist just got even better!' },
        { title: '💫 Sparkle alert!', message: 'New wish added successfully!' },
        { title: '🎯 Bullseye!', message: 'Wish locked and loaded!' },
        { title: '🦄 Unicorn approved!', message: 'Magical wish added!' },
        { title: '🎪 Ta-da!', message: 'Your wish made it to the show!' },
        { title: '💥 Kaboom!', message: 'Wish explosion successful!' },
        { title: '🎈 Floating high!', message: 'Your wish is in the air!' },
        { title: '⭐ Stellar!', message: 'Wish added to the galaxy!' },
    ],
    ITEM_DELETED: [
        { title: '👋 Bye bye!', message: 'Item removed from wishlist' },
        { title: '✅ Done!', message: 'Wish removed successfully' },
        { title: '🗑️ Cleaned up!', message: 'Item deleted' },
    ],
    WISHLIST_CREATED: [
        { title: '🎉 Amazing!', message: 'Your wishlist is ready!' },
        { title: '✨ Magic!', message: 'Wishlist created successfully!' },
        { title: '🚀 Launched!', message: 'Your wishlist is live!' },
    ],
};

export const ERROR_MESSAGES = {
    NETWORK: '📡 Oops! Connection hiccup. Try again?',
    DUPLICATE: '🤔 Hmm... This item is already in your wishlist!',
    NOT_FOUND: '😅 That wishlist seems to have vanished!',
    PERMISSION: '🔒 You don\'t have permission to do that',
    GENERIC: '💥 Something went wrong. Let\'s try that again!',
};

/**
 * Get a random success message
 */
export const getRandomSuccessMessage = (type: keyof typeof SUCCESS_MESSAGES) => {
    const messages = SUCCESS_MESSAGES[type];
    return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Get appropriate error message based on error code
 */
export const getErrorMessage = (error: any): string => {
    if (!error) return ERROR_MESSAGES.GENERIC;

    const errorString = error.message || error.toString();

    if (error.code === '23505' || errorString.includes('duplicate')) {
        return ERROR_MESSAGES.DUPLICATE;
    }
    if (error.code === '23503' || errorString.includes('not found')) {
        return ERROR_MESSAGES.NOT_FOUND;
    }
    if (errorString.includes('network') || errorString.includes('fetch')) {
        return ERROR_MESSAGES.NETWORK;
    }
    if (errorString.includes('permission') || errorString.includes('unauthorized')) {
        return ERROR_MESSAGES.PERMISSION;
    }

    return `${ERROR_MESSAGES.GENERIC}\n${errorString}`;
};
