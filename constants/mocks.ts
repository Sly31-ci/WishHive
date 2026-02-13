/**
 * 📦 MOCK DATA - Pour le développement V2
 */

export const MOCK_STORIES = [
    { id: '1', userId: 'u1', userName: 'Sarah', userAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', hasUnseen: true },
    { id: '2', userId: 'u2', userName: 'Mike', userAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', hasUnseen: true },
    { id: '3', userId: 'u3', userName: 'Jessica', userAvatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d', hasUnseen: false },
    { id: '4', userId: 'u4', userName: 'David', userAvatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', hasUnseen: true },
    { id: '5', userId: 'u5', userName: 'Emily', userAvatar: 'https://i.pravatar.cc/150?u=a04258114e29026708c', hasUnseen: false },
    { id: '6', userId: 'u6', userName: 'Tom', userAvatar: 'https://i.pravatar.cc/150?u=a04258114e29026709c', hasUnseen: true },
];

export const MOCK_FEED = [
    {
        id: '1',
        title: 'Summer Birthday Bash 🎂',
        description: 'Turning 25! Here is everything I dream of for my quarter-live crisis party 🎉',
        coverImage: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af38?q=80&w=1000&auto=format&fit=crop',
        user: {
            id: 'u1',
            name: 'Sarah Jenkins',
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
            level: 12
        },
        stats: {
            likes: 42,
            comments: 8,
            itemsCount: 15,
            fundedPercentage: 65
        },
        itemsPreview: [],
        createdAt: '2025-06-15'
    },
    {
        id: '2',
        title: 'Dream Setup 2026 💻',
        description: 'Upgrading my home office for maximum productivity. Any contribution helps!',
        coverImage: 'https://images.unsplash.com/photo-1493723843684-a43684fd76cd?q=80&w=1000&auto=format&fit=crop',
        user: {
            id: 'u2',
            name: 'Mike Ross',
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
            level: 8
        },
        stats: {
            likes: 128,
            comments: 24,
            itemsCount: 8,
            fundedPercentage: 30
        },
        itemsPreview: [],
        createdAt: '2025-06-14'
    },
    {
        id: '3',
        title: 'Cozy Winter Wedding 💍',
        description: 'Our wedding registry. We are so excited to celebrate with you all!',
        coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop',
        user: {
            id: 'u3',
            name: 'Jessica & Tom',
            avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d',
            level: 24
        },
        stats: {
            likes: 342,
            comments: 56,
            itemsCount: 45,
            fundedPercentage: 12
        },
        itemsPreview: [],
        createdAt: '2025-06-10'
    },
    {
        id: '4',
        title: 'Baby Shower 👶',
        description: 'We are expecting! Here are some things we need for the little one.',
        coverImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop',
        user: {
            id: 'u4',
            name: 'Emily Davis',
            avatar: 'https://i.pravatar.cc/150?u=a04258114e29026708c',
            level: 15
        },
        stats: {
            likes: 89,
            comments: 12,
            itemsCount: 22,
            fundedPercentage: 45
        },
        itemsPreview: [],
        createdAt: '2025-06-08'
    }
];

export const MOCK_NOTIFICATIONS = [
    { id: '1', type: 'like', user: 'Mike Ross', content: 'liked your wishlist', time: '2m' },
    { id: '2', type: 'comment', user: 'Sarah Jenkins', content: 'commented: "Love this!"', time: '15m' },
    { id: '3', type: 'follow', user: 'Jessica & Tom', content: 'started following you', time: '1h' },
];

export const MOCK_WISHLIST_ITEMS = [
    {
        id: '1',
        name: 'Sony WH-1000XM5',
        price: 349.99,
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop',
        priority: 'high', // high, medium, low
        status: 'open',
        url: 'https://amazon.com/...',
        shared_with: []
    },
    {
        id: '2',
        name: 'Herman Miller Aeron',
        price: 1250.00,
        image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop',
        priority: 'high',
        status: 'partial', // partially funded
        fundedAmount: 450,
        shared_with: []
    },
    {
        id: '3',
        name: 'Mechanical Keyboard',
        price: 159.00,
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop',
        priority: 'medium',
        status: 'reserved',
        reservedBy: { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        shared_with: []
    },
    {
        id: '4',
        name: '4K Monitor',
        price: 499.00,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop',
        priority: 'medium',
        status: 'open',
        shared_with: []
    },
    {
        id: '5',
        name: 'Desk Lamp',
        price: 45.00,
        image: 'https://images.unsplash.com/photo-1534073828943-f801091a7d58?q=80&w=1000&auto=format&fit=crop',
        priority: 'low',
        status: 'open',
        shared_with: []
    },
    {
        id: '6',
        name: 'Ergonomic Mouse',
        price: 89.00,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop',
        priority: 'low',
        status: 'purchased',
        purchasedBy: { name: 'Mike', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        shared_with: []
    },
];
