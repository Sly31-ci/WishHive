# Mode Développement - Guide d'Utilisation

## 🎯 Objectif

Le mode développement permet de parcourir toutes les interfaces de l'application **sans authentification** et de **tester différents types d'utilisateurs** pour valider l'UI et les fonctionnalités.

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
- ✅ **Profils de test** - Changez de profil utilisateur en un clic
- ✅ **Données mockées** - Chaque profil a ses propres données de test

## 👥 Profils de Test Disponibles

Un bouton flottant apparaît en bas à droite de l'écran pour changer de profil :

### 👤 Utilisateur Normal (TestUser)
- **Type** : Utilisateur classique
- **Niveau** : 3
- **Points** : 150
- **Wishlists** : 1 wishlist de Noël
- **Badges** : Badge "Premier Pas"

### 🏪 Vendeur (BoutiqueTest)
- **Type** : Compte vendeur vérifié
- **Niveau** : 8
- **Points** : 850
- **Wishlists** : Aucune
- **Badges** : "Vendeur Vérifié", "Top Vendeur"
- **Accès** : Dashboard vendeur, gestion de produits

### ⚡ Administrateur (AdminTest)
- **Type** : Administrateur avec accès complet
- **Niveau** : 99
- **Points** : 9999
- **Wishlists** : Aucune
- **Badges** : Badge "Administrateur"
- **Accès** : Toutes les fonctionnalités admin

### 🚀 Power User (PowerUser)
- **Type** : Utilisateur très actif
- **Niveau** : 15
- **Points** : 2500
- **Wishlists** : 3 wishlists (Anniversaire, Mariage, Tech)
- **Badges** : "Collectionneur", "Populaire", "Contributeur"

## 🔄 Changer de Profil

1. **Cliquez** sur le bouton flottant coloré en bas à droite
2. **Sélectionnez** le profil souhaité dans la liste
3. **L'interface** se met à jour automatiquement avec les données du profil

Le profil sélectionné est **sauvegardé** et sera restauré au prochain lancement.

## 📱 Navigation Disponible

Vous pourrez accéder à :

### Onglet Home (Feed)
- Voir le layout principal
- Tester les interactions

### Onglet Wishlists
- Interface de liste de wishlists
- Bouton de création
- Wishlists spécifiques au profil actif

### Onglet Marketplace
- Catalogue de produits
- Recherche et filtres

### Onglet Profile
- Profil utilisateur actif
- Badges et points du profil
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
- Les fonctionnalités nécessitant Supabase utilisent des données mockées
- Idéal pour tester l'UI, les animations et les différents types d'utilisateurs

---

**Prêt à explorer !** 🚀 Redémarrez Expo et scannez le QR code.
