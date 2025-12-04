import { EventEmitter } from 'events';

/**
 * Global event emitter for wishlist-related events
 * Enables real-time communication between screens
 */
class WishlistEvents extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(20); // Prevent memory leak warnings
    }
}

export const wishlistEvents = new WishlistEvents();

/**
 * Event types for wishlist operations
 */
export const EVENTS = {
    ITEM_ADDED: 'item:added',
    ITEM_DELETED: 'item:deleted',
    ITEM_UPDATED: 'item:updated',
    WISHLIST_CREATED: 'wishlist:created',
    WISHLIST_UPDATED: 'wishlist:updated',
    WISHLIST_DELETED: 'wishlist:deleted',
} as const;

/**
 * Type-safe event emitter helpers
 */
export const emitItemAdded = (wishlistId: string, item: any) => {
    wishlistEvents.emit(EVENTS.ITEM_ADDED, { wishlistId, item });
};

export const emitItemDeleted = (wishlistId: string, itemId: string) => {
    wishlistEvents.emit(EVENTS.ITEM_DELETED, { wishlistId, itemId });
};

export const emitItemUpdated = (wishlistId: string, item: any) => {
    wishlistEvents.emit(EVENTS.ITEM_UPDATED, { wishlistId, item });
};
