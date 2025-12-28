# Mode Développement - Guide d'Utilisation

## 🎯 Objectif
Le mode développement permet de parcourir toutes les interfaces de l'application **sans authentification** et de **tester différents types d'utilisateurs** pour valider l'UI et les fonctionnalités.

## ⚙️ Activation

### Étape 1 : Activer le mode DEV
Vérifiez votre fichier `.env` :
```bash
EXPO_PUBLIC_DEV_MODE=true
```

### Étape 2 : Redémarrer Expo
```bash
npx expo start --clear
```

## ✅ Résultat
Avec le mode DEV activé :
- ✅ **Pas de login requis** - L'app va directement aux onglets principaux.
- ✅ **Profile Selector** - Bouton flottant en bas à droite pour changer d'identité.
- ✅ **Données mockées** - Chaque profil (User, Seller, Admin) a ses propres données.

## 👥 Profils de Test
- **Utilisateur Normal** : TestUser (Niveau 3, 150 pts).
- **Vendeur** : BoutiqueTest (Niveau 8, 850 pts, Dashboard Seller).
- **Administrateur** : AdminTest (Niveau 99, Accès complet).

## 🛠️ Scripts Utilitaires (Dossier /scripts)
Si vous devez manipuler la base de données en dev :

```bash
# Tester la connexion Supabase
node scripts/test-supabase.js

# Créer des utilisateurs de test
node scripts/create-test-users.js

# Inscrire un profil vendeur
node scripts/create-seller-record.js
```

## ⚠️ Sécurité
- Ce mode est **uniquement pour le développement local**.
- Ne jamais déployer une application avec `EXPO_PUBLIC_DEV_MODE=true` sur les stores.

---
**WishHive Dev Mode** - Joyeux codage ! 🚀

