export interface WishlistTheme {
    template: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    emoji: string;
    coverImage?: string;
    gradient: boolean;
    style: 'fun' | 'romantic' | 'minimal' | 'trendy' | 'kawaii';
    pattern?: 'snowflakes' | 'hearts' | 'stars' | 'confetti' | null;
}

export const DEFAULT_THEME: WishlistTheme = {
    template: 'minimal',
    primaryColor: '#1F2937',
    secondaryColor: '#F3F4F6',
    accentColor: '#6B7280',
    emoji: '🌙',
    gradient: false,
    style: 'minimal',
};

export const WISHLIST_TEMPLATES: WishlistTheme[] = [
    {
        template: 'christmas',
        primaryColor: '#DC2626', // Red
        secondaryColor: '#16A34A', // Green
        accentColor: '#F59E0B', // Gold
        emoji: '🎄',
        gradient: true,
        style: 'fun',
        pattern: 'snowflakes',
    },
    {
        template: 'birthday',
        primaryColor: '#EC4899', // Pink
        secondaryColor: '#8B5CF6', // Violet
        accentColor: '#FBBF24', // Yellow
        emoji: '🎂',
        gradient: true,
        style: 'fun',
        pattern: 'confetti',
    },
    {
        template: 'wedding',
        primaryColor: '#FFFFFF', // White
        secondaryColor: '#F3E8FF', // Pale Pink
        accentColor: '#F59E0B', // Gold
        emoji: '💍',
        gradient: true,
        style: 'romantic',
        pattern: 'hearts',
    },
    {
        template: 'kawaii',
        primaryColor: '#FFC0CB', // Pastel Pink
        secondaryColor: '#B0E0E6', // Pastel Blue
        accentColor: '#FFD700', // Soft Yellow
        emoji: '🎁',
        gradient: true,
        style: 'kawaii',
        pattern: 'stars',
    },
    {
        template: 'minimal',
        primaryColor: '#1F2937', // Black
        secondaryColor: '#F3F4F6', // Light Gray
        accentColor: '#6B7280', // Medium Gray
        emoji: '🌙',
        gradient: false,
        style: 'minimal',
    },
    {
        template: 'trendy',
        primaryColor: '#F97316', // Orange
        secondaryColor: '#DC2626', // Red
        accentColor: '#000000', // Black
        emoji: '🔥',
        gradient: true,
        style: 'trendy',
    },
    {
        template: 'glow',
        primaryColor: '#8B5CF6', // Violet
        secondaryColor: '#06B6D4', // Cyan
        accentColor: '#EC4899', // Magenta
        emoji: '🪩',
        gradient: true,
        style: 'fun',
    },
    {
        template: 'travel',
        primaryColor: '#0EA5E9', // Blue
        secondaryColor: '#14B8A6', // Turquoise
        accentColor: '#FBBF24', // Sun Yellow
        emoji: '✈️',
        gradient: true,
        style: 'fun',
    },
];
