export type DiceBearStyle = 'avataaars' | 'bottts' | 'personas' | 'lorelei';

export interface DiceBearAvatar {
    seed: string;
    url: string;
    style: DiceBearStyle;
}

export const DICEBEAR_STYLES: { id: DiceBearStyle; name: string; emoji: string }[] = [
    { id: 'avataaars', name: 'Avataaars', emoji: '😊' },
    { id: 'bottts', name: 'Bottts', emoji: '🤖' },
    { id: 'personas', name: 'Personas', emoji: '👤' },
    { id: 'lorelei', name: 'Lorelei', emoji: '🎮' },
];

export const generateDiceBearUrl = (seed: string, style: DiceBearStyle): string => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
};

export const generateAvatarCollection = (count: number, style: DiceBearStyle): DiceBearAvatar[] => {
    return Array.from({ length: count }).map((_, i) => {
        // Generate deterministic seeds for "presets" if needed, or random
        const seed = Math.random().toString(36).substring(7);
        return {
            seed,
            url: generateDiceBearUrl(seed, style),
            style,
        };
    });
};

export const getPresetAvatars = (style: DiceBearStyle): DiceBearAvatar[] => {
    // Use fixed seeds to show consistent presets
    const fixedSeeds = [
        'Felix', 'Aneka', 'Zack', 'Midnight', 'Tiger',
        'Luna', 'Boots', 'Shadow', 'Misty', 'Pepper',
        'Ginger', 'Buddy', 'Bella', 'Charlie', 'Max',
        'Lucy', 'Daisy', 'Rocky', 'Coco', 'Molly'
    ];

    return fixedSeeds.map(seed => ({
        seed,
        url: generateDiceBearUrl(seed, style),
        style,
    }));
};
