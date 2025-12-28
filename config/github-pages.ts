/**
 * 🔗 Configuration GitHub Pages pour Wishlists Publiques
 * 
 * Ce fichier contient la configuration pour générer les liens publics
 * vers les wishlists partagées via GitHub Pages.
 */

// ============================================
// CONFIGURATION À PERSONNALISER
// ============================================

export const GITHUB_PAGES_CONFIG = {
    // Votre username GitHub
    username: 'Sly31-ci', // MODIFIER ICI

    // Nom du repo (généralement 'WishHive')
    repo: 'WishHive',

    // URL de base (sera construite automatiquement)
    get baseUrl() {
        return `https://${this.username}.github.io/${this.repo}`;
    },

    // Path vers les wishlists
    wishlistPath: '/w/',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Génère l'URL publique d'une wishlist
 * @param wishlistId - ID de la wishlist
 * @returns URL complète pour GitHub Pages
 */
export function generatePublicWishlistUrl(wishlistId: string): string {
    return `${GITHUB_PAGES_CONFIG.baseUrl}${GITHUB_PAGES_CONFIG.wishlistPath}?id=${wishlistId}`;
}

/**
 * Génère le deep link vers l'app
 * @param wishlistId - ID de la wishlist
 * @returns Deep link URI
 */
export function generateDeepLink(wishlistId: string): string {
    return `wishhive://wishlists/${wishlistId}`;
}

/**
 * Partage une wishlist avec le texte par défaut
 * @param wishlistId - ID de la wishlist
 * @param wishlistTitle - Titre de la wishlist
 * @returns Message de partage + URL
 */
export function getShareMessage(wishlistId: string, wishlistTitle: string): {
    message: string;
    url: string;
} {
    const url = generatePublicWishlistUrl(wishlistId);

    return {
        message: `🎁 Découvre ma wishlist "${wishlistTitle}" sur WishHive !\n\n${url}`,
        url,
    };
}

/**
 * Vérifie si une wishlist est publique (requis pour partage)
 * @param privacy - Niveau de confidentialité
 * @returns true si partageable
 */
export function canSharePublicly(privacy: string): boolean {
    return privacy === 'public';
}

// ============================================
// EXEMPLE D'UTILISATION
// ============================================

/*
import { generatePublicWishlistUrl, getShareMessage } from '@/config/github-pages';
import { Share } from 'react-native';

// Dans votre composant ShareWishlistButton
const handleShare = async () => {
  if (!canSharePublicly(wishlist.privacy)) {
    Alert.alert(
      'Wishlist privée',
      'Cette wishlist doit être publique pour être partagée.'
    );
    return;
  }

  const { message, url } = getShareMessage(wishlist.id, wishlist.title);

  try {
    await Share.share({
      message: Platform.OS === 'ios' ? message : url,
      url: Platform.OS === 'ios' ? url : undefined,
      title: `Wishlist: ${wishlist.title}`,
    });
  } catch (error) {
    console.error('Error sharing:', error);
  }
};
*/

// ============================================
// CONFIGURATION EXPO (app.json)
// ============================================

/*
Pour activer les deep links, ajouter dans app.json :

{
  "expo": {
    "scheme": "wishhive",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "https",
              "host": "Sly31-ci.github.io",
              "pathPrefix": "/WishHive/w"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    "ios": {
      "associatedDomains": [
        "applinks:Sly31-ci.github.io"
      ],
      "bundleIdentifier": "com.wishhive.app"
    }
  }
}
*/
