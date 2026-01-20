export interface TypographySettings {
    // Police d'écriture
    fontFamily: 'system' | 'fun' | 'minimal' | 'handwritten' | 'elegant' | 'modern';

    // Taille
    fontSize: number; // 14-48px

    // Couleur
    color: string; // Hex color

    // Alignement
    alignment: 'left' | 'center' | 'right';

    // Effets de base
    bold: boolean;
    italic: boolean;
    uppercase: boolean;

    // Effets avancés - Shadow
    shadow: boolean;
    shadowColor?: string;
    shadowOffset?: { x: number; y: number };
    shadowBlur?: number;

    // Effets avancés - Outline
    outline: boolean;
    outlineColor?: string;
    outlineWidth?: number;

    // Espacement
    letterSpacing: number; // -2 to 10
    lineHeight: number; // 1.0 to 2.0
}

export type BackgroundType = 'solid' | 'gradient' | 'image' | 'emoji';

export interface BackgroundSettings {
    type: BackgroundType;

    // Pour solid/gradient
    solidColor?: string;
    gradientColors?: string[]; // 2-3 couleurs
    gradientDirection?: 'vertical' | 'horizontal' | 'diagonal';

    // Pour image
    imageUrl?: string;
    imagePreset?: string; // 'christmas', 'birthday', 'wedding', etc.
    imageFilter?: {
        blur: number; // 0-10
        brightness: number; // 0.5-1.5
        contrast: number; // 0.5-1.5
        vignette: boolean;
        vignetteIntensity?: number; // 0-1
    };

    // Pour emoji wall
    emojis?: string[]; // 1-3 emojis
    emojiDensity?: 'low' | 'medium' | 'high'; // 20, 40, 60 emojis
    emojiSize?: number; // 20-80px
    emojiRotation?: boolean;
    emojiPattern?: 'grid' | 'diagonal' | 'random' | 'scattered';
    emojiOpacity?: number; // 0.1-1.0
}

export interface CardStyleSettings {
    shape: 'rounded' | 'square' | 'pill';
    borderRadius: number; // 0-24px
    borderWidth: number; // 0-4px
    borderColor?: string;
    shadow: boolean;
    shadowIntensity?: 'light' | 'medium' | 'strong';
    effect?: 'none' | 'glassmorphism' | 'neon' | 'honey';
    backgroundColor?: string;
    backgroundOpacity?: number; // 0.5-1.0
}

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
    typography?: TypographySettings;
    background?: BackgroundSettings;
    cardStyle?: CardStyleSettings;
}

/**
 * 🎨 THÈME PAR DÉFAUT WISHHIVE - REFONTE PREMIUM
 * 
 * Règles strictes :
 * - Fond UNI et DOUX (teinte claire)
 * - Aucun motif complexe
 * - Priorité absolue à la lisibilité
 * - Design simple, professionnel, friendly
 */
export const DEFAULT_THEME: WishlistTheme = {
    template: 'hive',
    primaryColor: '#FFB937',      // 🟡 Honey Glow - Identité WishHive
    secondaryColor: '#7F5BFF',    // 🟣 Hive Purple - Identité WishHive
    accentColor: '#00B37E',       // 🟢 Success
    emoji: '🐝',
    gradient: false,              // ❌ Pas de gradient par défaut
    style: 'minimal',             // ✅ Style minimaliste et pro
    pattern: null,                // ❌ Aucun motif
    background: {
        type: 'solid',
        solidColor: '#FFFBF5',    // ✅ Blanc cassé très doux (teinte miel subtile)
    },
    cardStyle: {
        shape: 'rounded',
        borderRadius: 12,         // ✅ Arrondi doux (12px)
        borderWidth: 0,           // ❌ Pas de bordure (plus propre)
        shadow: true,
        shadowIntensity: 'light', // ✅ Ombre très subtile
        effect: 'none',           // ❌ Aucun effet spécial
        backgroundOpacity: 1.0,
        backgroundColor: '#FFFFFF', // ✅ Cartes blanches pures
    },
};

export const WISHLIST_TEMPLATES: WishlistTheme[] = [
    // 🎄 Noël
    {
        template: 'christmas',
        primaryColor: '#DC2626',
        secondaryColor: '#16A34A',
        accentColor: '#F59E0B',
        emoji: '🎄',
        gradient: true,
        style: 'fun',
        pattern: 'snowflakes',
        background: {
            type: 'image',
            imagePreset: 'christmas',
            imageFilter: { blur: 2, brightness: 1.1, contrast: 1.0, vignette: true, vignetteIntensity: 0.3 },
        },
        cardStyle: {
            shape: 'rounded',
            borderRadius: 16,
            borderWidth: 0,
            shadow: true,
            shadowIntensity: 'medium',
            effect: 'glassmorphism',
            backgroundOpacity: 0.9,
        },
    },
    // 🎂 Anniversaire
    {
        template: 'birthday',
        primaryColor: '#EC4899',
        secondaryColor: '#8B5CF6',
        accentColor: '#FBBF24',
        emoji: '🎂',
        gradient: true,
        style: 'fun',
        pattern: 'confetti',
        background: {
            type: 'gradient',
            gradientColors: ['#EC4899', '#8B5CF6', '#FBBF24'],
            gradientDirection: 'diagonal',
        },
        cardStyle: {
            shape: 'rounded',
            borderRadius: 20,
            borderWidth: 2,
            borderColor: '#FFFFFF',
            shadow: true,
            shadowIntensity: 'strong',
            effect: 'neon',
            backgroundOpacity: 0.95,
        },
    },
    // 💍 Mariage
    {
        template: 'wedding',
        primaryColor: '#FFFFFF',
        secondaryColor: '#F3E8FF',
        accentColor: '#F59E0B',
        emoji: '💍',
        gradient: true,
        style: 'romantic',
        pattern: 'hearts',
        background: {
            type: 'image',
            imagePreset: 'wedding',
            imageFilter: { blur: 3, brightness: 1.3, contrast: 1.0, vignette: true, vignetteIntensity: 0.4 },
        },
        cardStyle: {
            shape: 'rounded',
            borderRadius: 12,
            borderWidth: 0,
            shadow: true,
            shadowIntensity: 'light',
            effect: 'glassmorphism',
            backgroundOpacity: 0.85,
        },
    },
    // 💝 Love List
    {
        template: 'love',
        primaryColor: '#DC2626',
        secondaryColor: '#EC4899',
        accentColor: '#F87171',
        emoji: '💝',
        gradient: true,
        style: 'romantic',
        pattern: 'hearts',
        background: {
            type: 'emoji',
            emojis: ['💖', '💕', '💗'],
            emojiDensity: 'medium',
            emojiSize: 40,
            emojiRotation: true,
            emojiPattern: 'scattered',
            emojiOpacity: 0.15,
        },
        cardStyle: {
            shape: 'pill',
            borderRadius: 24,
            borderWidth: 0,
            shadow: true,
            shadowIntensity: 'medium',
            effect: 'none',
            backgroundOpacity: 0.95,
        },
    },
    // 🐝 Hive Theme
    {
        template: 'hive',
        primaryColor: '#FFB937',
        secondaryColor: '#7F5BFF',
        accentColor: '#2DE4A7',
        emoji: '🐝',
        gradient: true,
        style: 'trendy',
        pattern: null,
        background: {
            type: 'emoji',
            emojis: ['🍯', '🐝'],
            emojiDensity: 'low',
            emojiSize: 60,
            emojiRotation: false,
            emojiPattern: 'grid',
            emojiOpacity: 0.1,
        },
        cardStyle: {
            shape: 'rounded',
            borderRadius: 16,
            borderWidth: 2,
            borderColor: '#FFB937',
            shadow: true,
            shadowIntensity: 'medium',
            effect: 'honey',
            backgroundOpacity: 0.9,
        },
    },
    // 🌙 Dark Elegant
    {
        template: 'dark-elegant',
        primaryColor: '#0F0E15',
        secondaryColor: '#1C1B27',
        accentColor: '#7F5BFF',
        emoji: '🌙',
        gradient: true,
        style: 'minimal',
        pattern: null,
        background: {
            type: 'gradient',
            gradientColors: ['#0F0E15', '#1C1B27', '#7F5BFF'],
            gradientDirection: 'vertical',
        },
        cardStyle: {
            shape: 'square',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#7F5BFF',
            shadow: true,
            shadowIntensity: 'strong',
            effect: 'glassmorphism',
            backgroundOpacity: 0.7,
        },
    },
    // 🎮 Gaming
    {
        template: 'gaming',
        primaryColor: '#00FF00',
        secondaryColor: '#FF00FF',
        accentColor: '#00FFFF',
        emoji: '🎮',
        gradient: true,
        style: 'trendy',
        pattern: null,
        background: {
            type: 'image',
            imagePreset: 'gaming',
            imageFilter: { blur: 0, brightness: 0.9, contrast: 1.2, vignette: false },
        },
        cardStyle: {
            shape: 'square',
            borderRadius: 4,
            borderWidth: 2,
            borderColor: '#00FF00',
            shadow: true,
            shadowIntensity: 'strong',
            effect: 'neon',
            backgroundOpacity: 0.85,
        },
    },
    // 🌸 Kawaii
    {
        template: 'kawaii',
        primaryColor: '#FFC0CB',
        secondaryColor: '#B0E0E6',
        accentColor: '#FFD700',
        emoji: '🌸',
        gradient: true,
        style: 'kawaii',
        pattern: 'stars',
        background: {
            type: 'emoji',
            emojis: ['🌸', '🎀', '✨'],
            emojiDensity: 'high',
            emojiSize: 30,
            emojiRotation: false,
            emojiPattern: 'diagonal',
            emojiOpacity: 0.2,
        },
        cardStyle: {
            shape: 'pill',
            borderRadius: 24,
            borderWidth: 3,
            borderColor: '#FFFFFF',
            shadow: true,
            shadowIntensity: 'light',
            effect: 'none',
            backgroundOpacity: 0.95,
        },
    },
    // 🕶 Minimal Black
    {
        template: 'minimal-black',
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF',
        accentColor: '#6B7280',
        emoji: '🕶',
        gradient: false,
        style: 'minimal',
        pattern: null,
        background: {
            type: 'solid',
            solidColor: '#000000',
        },
        cardStyle: {
            shape: 'square',
            borderRadius: 0,
            borderWidth: 1,
            borderColor: '#FFFFFF',
            shadow: false,
            shadowIntensity: 'light',
            effect: 'none',
            backgroundOpacity: 1.0,
        },
    },
    // 🌈 Rainbow Fun
    {
        template: 'rainbow',
        primaryColor: '#FF0000',
        secondaryColor: '#0000FF',
        accentColor: '#FFFF00',
        emoji: '🌈',
        gradient: true,
        style: 'fun',
        pattern: null,
        background: {
            type: 'gradient',
            gradientColors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'],
            gradientDirection: 'diagonal',
        },
        cardStyle: {
            shape: 'rounded',
            borderRadius: 20,
            borderWidth: 0,
            shadow: true,
            shadowIntensity: 'strong',
            effect: 'glassmorphism',
            backgroundOpacity: 0.9,
        },
    },
];

// Polices disponibles
export const FONT_FAMILIES = {
    system: {
        name: 'Système',
        fontFamily: 'System',
        description: 'Police par défaut',
        preview: 'Aa',
    },
    fun: {
        name: 'Fun',
        fontFamily: 'System', // Poppins-Bold si disponible
        description: 'Joyeuse et dynamique',
        preview: 'Aa',
        weight: '700' as const,
    },
    minimal: {
        name: 'Minimaliste',
        fontFamily: 'System', // Inter-Regular si disponible
        description: 'Sobre et moderne',
        preview: 'Aa',
        weight: '400' as const,
    },
    handwritten: {
        name: 'Manuscrite',
        fontFamily: 'System', // Caveat-Regular si disponible
        description: 'Personnelle et chaleureuse',
        preview: 'Aa',
        style: 'italic' as const,
    },
    elegant: {
        name: 'Élégante',
        fontFamily: 'System', // Playfair Display si disponible
        description: 'Raffinée et sophistiquée',
        preview: 'Aa',
        weight: '600' as const,
    },
    modern: {
        name: 'Moderne',
        fontFamily: 'System', // Montserrat-SemiBold si disponible
        description: 'Contemporaine et audacieuse',
        preview: 'Aa',
        weight: '600' as const,
    },
};

// Couleurs recommandées pour le texte
export const RECOMMENDED_TEXT_COLORS = {
    light: [
        { name: 'Noir', color: '#000000', contrast: 'high' },
        { name: 'Gris Foncé', color: '#1F2937', contrast: 'high' },
        { name: 'Bleu Nuit', color: '#1E3A8A', contrast: 'high' },
        { name: 'Vert Forêt', color: '#065F46', contrast: 'medium' },
        { name: 'Bordeaux', color: '#7F1D1D', contrast: 'medium' },
    ],
    dark: [
        { name: 'Blanc', color: '#FFFFFF', contrast: 'high' },
        { name: 'Crème', color: '#FEF3C7', contrast: 'high' },
        { name: 'Bleu Clair', color: '#DBEAFE', contrast: 'medium' },
        { name: 'Rose Pâle', color: '#FCE7F3', contrast: 'medium' },
        { name: 'Vert Menthe', color: '#D1FAE5', contrast: 'medium' },
    ],
    vibrant: [
        { name: 'Rouge Vif', color: '#DC2626', contrast: 'high' },
        { name: 'Violet', color: '#7C3AED', contrast: 'high' },
        { name: 'Orange', color: '#EA580C', contrast: 'medium' },
        { name: 'Turquoise', color: '#06B6D4', contrast: 'medium' },
        { name: 'Rose Fuchsia', color: '#EC4899', contrast: 'medium' },
    ],
};

// Paramètres par défaut de typographie
export const DEFAULT_TYPOGRAPHY: TypographySettings = {
    fontFamily: 'system',
    fontSize: 24,
    color: '#1F2937',
    alignment: 'left',
    bold: false,
    italic: false,
    uppercase: false,
    shadow: false,
    shadowColor: '#000000',
    shadowOffset: { x: 2, y: 2 },
    shadowBlur: 4,
    outline: false,
    outlineColor: '#FFFFFF',
    outlineWidth: 2,
    letterSpacing: 0,
    lineHeight: 1.2,
};

// Palettes intelligentes selon le thème
export const SMART_COLOR_PALETTES = {
    christmas: {
        name: 'Noël',
        colors: ['#DC2626', '#16A34A', '#F59E0B', '#FFFFFF'],
        gradient: ['#DC2626', '#16A34A'],
    },
    birthday: {
        name: 'Anniversaire',
        colors: ['#EC4899', '#8B5CF6', '#FBBF24', '#F97316'],
        gradient: ['#EC4899', '#8B5CF6'],
    },
    wedding: {
        name: 'Mariage',
        colors: ['#FFFFFF', '#F3E8FF', '#F59E0B', '#FDF2F8'],
        gradient: ['#FFFFFF', '#F3E8FF'],
    },
    love: {
        name: 'Love',
        colors: ['#DC2626', '#EC4899', '#F87171', '#FCA5A5'],
        gradient: ['#DC2626', '#EC4899'],
    },
    hive: {
        name: 'Hive',
        colors: ['#FFB937', '#7F5BFF', '#2DE4A7', '#1E1C2E'],
        gradient: ['#FFB937', '#7F5BFF'],
    },
    dark: {
        name: 'Dark Elegant',
        colors: ['#0F0E15', '#1C1B27', '#7F5BFF', '#FFFFFF'],
        gradient: ['#0F0E15', '#7F5BFF'],
    },
    gaming: {
        name: 'Gaming',
        colors: ['#00FF00', '#FF00FF', '#00FFFF', '#000000'],
        gradient: ['#00FF00', '#FF00FF'],
    },
    kawaii: {
        name: 'Kawaii',
        colors: ['#FFC0CB', '#B0E0E6', '#FFD700', '#FFFFFF'],
        gradient: ['#FFC0CB', '#B0E0E6'],
    },
    minimal: {
        name: 'Minimal',
        colors: ['#000000', '#FFFFFF', '#F3F4F6', '#6B7280'],
        gradient: ['#000000', '#6B7280'],
    },
    rainbow: {
        name: 'Rainbow',
        colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'],
        gradient: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'],
    },
};

// Images prédéfinies (URLs à remplacer par de vraies images)
export const PRESET_IMAGES = {
    christmas: {
        name: 'Noël',
        url: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543',
        thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=200',
        suggestedFilters: { blur: 2, brightness: 1.1, contrast: 1.0, vignette: true, vignetteIntensity: 0.3 },
    },
    birthday: {
        name: 'Anniversaire',
        url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
        thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200',
        suggestedFilters: { blur: 1, brightness: 1.2, contrast: 1.0, vignette: false },
    },
    wedding: {
        name: 'Mariage',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552',
        thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200',
        suggestedFilters: { blur: 3, brightness: 1.3, contrast: 1.0, vignette: true, vignetteIntensity: 0.4 },
    },
    gaming: {
        name: 'Gaming',
        url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200',
        suggestedFilters: { blur: 0, brightness: 0.9, contrast: 1.2, vignette: false },
    },
    kawaii: {
        name: 'Kawaii',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
        suggestedFilters: { blur: 1, brightness: 1.2, contrast: 1.0, vignette: false },
    },
    luxury: {
        name: 'Luxe',
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
        thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200',
        suggestedFilters: { blur: 2, brightness: 0.8, contrast: 1.1, vignette: true, vignetteIntensity: 0.5 },
    },
};

// Paramètres par défaut de background
export const DEFAULT_BACKGROUND: BackgroundSettings = {
    type: 'solid',
    solidColor: '#F3F4F6',
};

// Paramètres par défaut de style de carte
export const DEFAULT_CARD_STYLE: CardStyleSettings = {
    shape: 'rounded',
    borderRadius: 12,
    borderWidth: 0,
    shadow: true,
    shadowIntensity: 'light',
    effect: 'none',
    backgroundOpacity: 1.0,
};

