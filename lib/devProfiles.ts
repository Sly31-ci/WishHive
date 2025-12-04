import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Wishlist = Database['public']['Tables']['wishlists']['Row'];
type Badge = Database['public']['Tables']['badges']['Row'];

export interface DevProfile {
    id: string;
    type: 'normal' | 'seller' | 'admin' | 'power';
    profile: Profile;
    wishlists?: Wishlist[];
    badges?: Badge[];
    isSeller?: boolean;
    isAdmin?: boolean;
}

// Mock dev profiles for testing
export const DEV_PROFILES: DevProfile[] = [
    {
        id: 'dev-normal-user',
        type: 'normal',
        profile: {
            id: 'dev-normal-user',
            username: 'TestUser',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestUser',
            bio: '👋 Utilisateur de test normal',
            points: 150,
            level: 3,
            settings: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        wishlists: [
            {
                id: 'wishlist-1',
                owner_id: 'dev-normal-user',
                title: 'Ma Wishlist de Noël 🎄',
                description: 'Mes cadeaux de Noël préférés',
                type: 'christmas',
                privacy: 'public',
                access_code: null,
                theme: { color: '#e74c3c', emoji: '🎄' },
                due_date: '2024-12-25',
                is_active: true,
                view_count: 42,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ],
        badges: [
            {
                id: 'badge-1',
                name: 'Premier Pas',
                description: 'Créé votre première wishlist',
                tier: 'bronze',
                icon: '🌟',
                created_at: new Date().toISOString(),
            },
        ],
        isSeller: false,
        isAdmin: false,
    },
    {
        id: 'dev-seller-user',
        type: 'seller',
        profile: {
            id: 'dev-seller-user',
            username: 'BoutiqueTest',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BoutiqueTest',
            bio: '🏪 Vendeur vérifié - Boutique de test',
            points: 850,
            level: 8,
            settings: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        wishlists: [],
        badges: [
            {
                id: 'badge-seller-1',
                name: 'Vendeur Vérifié',
                description: 'Compte vendeur vérifié',
                tier: 'gold',
                icon: '✓',
                created_at: new Date().toISOString(),
            },
            {
                id: 'badge-seller-2',
                name: 'Top Vendeur',
                description: 'Plus de 100 ventes',
                tier: 'platinum',
                icon: '👑',
                created_at: new Date().toISOString(),
            },
        ],
        isSeller: true,
        isAdmin: false,
    },
    {
        id: 'dev-admin-user',
        type: 'admin',
        profile: {
            id: 'dev-admin-user',
            username: 'AdminTest',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminTest',
            bio: '⚡ Administrateur - Accès complet',
            points: 9999,
            level: 99,
            settings: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        wishlists: [],
        badges: [
            {
                id: 'badge-admin-1',
                name: 'Administrateur',
                description: 'Membre de l\'équipe WishHive',
                tier: 'platinum',
                icon: '⚡',
                created_at: new Date().toISOString(),
            },
        ],
        isSeller: true,
        isAdmin: true,
    },
    {
        id: 'dev-power-user',
        type: 'power',
        profile: {
            id: 'dev-power-user',
            username: 'PowerUser',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PowerUser',
            bio: '🚀 Utilisateur actif avec plusieurs wishlists',
            points: 2500,
            level: 15,
            settings: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        wishlists: [
            {
                id: 'wishlist-power-1',
                owner_id: 'dev-power-user',
                title: 'Anniversaire 2024 🎂',
                description: 'Mes souhaits pour mon anniversaire',
                type: 'birthday',
                privacy: 'public',
                access_code: null,
                theme: { color: '#9b59b6', emoji: '🎂' },
                due_date: '2024-06-15',
                is_active: true,
                view_count: 156,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'wishlist-power-2',
                owner_id: 'dev-power-user',
                title: 'Mariage 💍',
                description: 'Liste de mariage',
                type: 'wedding',
                privacy: 'code_only',
                access_code: 'LOVE2024',
                theme: { color: '#e91e63', emoji: '💍' },
                due_date: '2024-09-20',
                is_active: true,
                view_count: 89,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'wishlist-power-3',
                owner_id: 'dev-power-user',
                title: 'Tech Wishlist 💻',
                description: 'Gadgets et technologie',
                type: 'other',
                privacy: 'public',
                access_code: null,
                theme: { color: '#3498db', emoji: '💻' },
                due_date: null,
                is_active: true,
                view_count: 234,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ],
        badges: [
            {
                id: 'badge-power-1',
                name: 'Collectionneur',
                description: '5+ wishlists créées',
                tier: 'silver',
                icon: '📚',
                created_at: new Date().toISOString(),
            },
            {
                id: 'badge-power-2',
                name: 'Populaire',
                description: '500+ vues sur vos wishlists',
                tier: 'gold',
                icon: '⭐',
                created_at: new Date().toISOString(),
            },
            {
                id: 'badge-power-3',
                name: 'Contributeur',
                description: 'Actif depuis 1 an',
                tier: 'platinum',
                icon: '🏆',
                created_at: new Date().toISOString(),
            },
        ],
        isSeller: false,
        isAdmin: false,
    },
];

// Get profile by ID
export const getDevProfile = (id: string): DevProfile | undefined => {
    return DEV_PROFILES.find(p => p.id === id);
};

// Get default dev profile
export const getDefaultDevProfile = (): DevProfile => {
    return DEV_PROFILES[0]; // Normal user by default
};
