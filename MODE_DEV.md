# Mode Développement - Guide d'Utilisation

## 🎯 Objectif

Le mode développement permet de parcourir toutes les interfaces de l'application **sans authentification** pour tester l'UI et les fonctionnalités visuelles.

## ⚙️ Activation

### Étape 1 : Activer le mode DEV

Le mode développement est **déjà activé** dans votre fichier `.env` :

```bash
EXPO_PUBLIC_DEV_MODE=true
```

### Étape 2 : Redémarrer Expo

Pour que le changement prenne effet :

1. **Arrêter** le serveur Expo (Ctrl+C dans le terminal)
2. **Relancer** : `npm run dev`
3. **Scanner** le QR code à nouveau dans Expo Go

## ✅ Résultat

Avec le mode DEV activé :
- ✅ **Pas de login requis** - L'app va directement aux onglets principaux
- ✅ **Navigation libre** - Vous pouvez explorer toutes les interfaces
- ✅ **Données mockées** - Les hooks retourneront des données vides (mais pas d'erreur)

## 📱 Navigation Disponible

Vous pourrez accéder à :

### Onglet Home (Feed)
- Voir le layout principal
- Tester les interactions

### Onglet Wishlists
- Interface de liste de wishlists
- Bouton de création

### Onglet Marketplace
- Catalogue de produits
- Recherche et filtres

### Onglet Profile
- Profil utilisateur
- Badges et points
- Paramètres

## 🔴 Désactivation

Pour revenir au mode normal avec authentification :

```bash
# Dans .env
EXPO_PUBLIC_DEV_MODE=false
```

Puis redémarrer Expo.

## ⚠️ Important

- Ce mode est **uniquement pour le développement**
- Ne **jamais** activer en production
- Les fonctionnalités nécessitant Supabase ne fonctionneront pas complètement
- Idéal pour tester l'UI et les animations

---

**Prêt à explorer !** 🚀 Redémarrez Expo et scannez le QR code.
