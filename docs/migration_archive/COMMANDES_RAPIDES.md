# ⚡ Commandes Rapides - Migration PocketBase

Aide-mémoire des commandes essentielles pour la migration PocketBase.

---

## 🚀 Démarrage

### Démarrer PocketBase

```bash
./start-pocketbase.sh
```

Ou manuellement:

```bash
cd pocketbase
./pocketbase serve
```

### Arrêter PocketBase

```
Ctrl + C
```

---

## 🔗 URLs importantes

| Service | URL |
|---------|-----|
| **PocketBase API** | http://127.0.0.1:8090 |
| **Interface Admin** | http://127.0.0.1:8090/_/ |
| **API Health** | http://127.0.0.1:8090/api/health |
| **Collections** | http://127.0.0.1:8090/_/#/collections |

---

## 🧪 Tests

### Tester la connexion PocketBase

```bash
node scripts/test-pocketbase-connection.js
```

### Vérifier la santé de PocketBase

```bash
curl http://127.0.0.1:8090/api/health
```

### Lister les collections

```bash
curl http://127.0.0.1:8090/api/collections
```

---

## 📦 Installation

### Installer le SDK PocketBase

```bash
npm install pocketbase
```

### Vérifier l'installation

```bash
npm list pocketbase
```

---

## ⚙️ Configuration

### Copier les variables d'environnement

```bash
cp .env.example .env
```

### Éditer les variables

```bash
nano .env
```

Contenu:

```env
EXPO_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
EXPO_PUBLIC_DEV_MODE=true
```

---

## 🔧 Développement

### Redémarrer Expo avec cache clear

```bash
npx expo start -c
```

### Démarrer Expo normalement

```bash
npx expo start
```

### Vérifier les erreurs TypeScript

```bash
npx tsc --noEmit
```

---

## 📊 Monitoring

### Voir les logs PocketBase

```bash
tail -f pocketbase/pb_data/logs/*.log
```

### Vérifier le port 8090

```bash
lsof -i :8090
```

### Tuer le processus sur le port 8090

```bash
lsof -ti :8090 | xargs kill -9
```

---

## 🗄️ Base de données

### Backup de la base de données

```bash
cp pocketbase/pb_data/data.db pocketbase/pb_data/data.db.backup
```

### Restaurer un backup

```bash
cp pocketbase/pb_data/data.db.backup pocketbase/pb_data/data.db
```

### Voir la taille de la base

```bash
du -sh pocketbase/pb_data/data.db
```

---

## 📚 Documentation

### Ouvrir la documentation

```bash
# Plan complet
cat PLAN_MIGRATION_POCKETBASE.md

# Guide rapide
cat GUIDE_DEMARRAGE_POCKETBASE.md

# État de la migration
cat ETAT_MIGRATION_POCKETBASE.md

# Résumé de session
cat RESUME_SESSION_MIGRATION.md
```

---

## 🔐 Sécurité

### Générer un code d'accès aléatoire

```bash
openssl rand -base64 12
```

### Générer un UUID

```bash
uuidgen
```

---

## 🧹 Nettoyage

### Nettoyer le cache Expo

```bash
npx expo start -c
```

### Nettoyer node_modules

```bash
rm -rf node_modules
npm install
```

### Nettoyer les logs PocketBase

```bash
rm -rf pocketbase/pb_data/logs/*
```

---

## 🚨 Dépannage

### PocketBase ne démarre pas

```bash
# Vérifier les permissions
chmod +x pocketbase/pocketbase

# Vérifier la version
pocketbase/pocketbase --version

# Démarrer en mode debug
cd pocketbase && ./pocketbase serve --debug
```

### Erreur de port déjà utilisé

```bash
# Trouver le processus
lsof -i :8090

# Tuer le processus
lsof -ti :8090 | xargs kill -9

# Redémarrer PocketBase
./start-pocketbase.sh
```

### Réinitialiser PocketBase

```bash
# ⚠️ ATTENTION: Supprime toutes les données!
rm -rf pocketbase/pb_data
cd pocketbase && ./pocketbase serve
```

---

## 📝 Git

### Commit des changements

```bash
git add .
git commit -m "🚀 Préparation migration PocketBase"
```

### Voir les fichiers modifiés

```bash
git status
```

### Voir les différences

```bash
git diff
```

---

## 🎯 Workflow de développement

### 1. Démarrer la session

```bash
# Terminal 1: PocketBase
./start-pocketbase.sh

# Terminal 2: Expo
npx expo start
```

### 2. Développer

- Modifier le code
- Tester dans l'app
- Vérifier les logs

### 3. Tester

```bash
# Tester la connexion
node scripts/test-pocketbase-connection.js

# Vérifier TypeScript
npx tsc --noEmit
```

### 4. Commit

```bash
git add .
git commit -m "feat: [description]"
```

---

## 📱 Expo

### Ouvrir sur iOS

```bash
npx expo start --ios
```

### Ouvrir sur Android

```bash
npx expo start --android
```

### Ouvrir dans le navigateur

```bash
npx expo start --web
```

---

## 🔄 Migration

### Exporter les données Supabase

```bash
# À créer
node scripts/export-supabase-data.js
```

### Importer dans PocketBase

```bash
# À créer
node scripts/import-to-pocketbase.js
```

### Créer les collections

```bash
# Via script (nécessite auth admin)
node scripts/create-pocketbase-collections.js

# Ou via l'interface admin (recommandé)
open http://127.0.0.1:8090/_/
```

---

## 💡 Astuces

### Alias utiles (à ajouter dans ~/.bashrc ou ~/.zshrc)

```bash
# PocketBase
alias pb-start='cd ~/path/to/WishHive && ./start-pocketbase.sh'
alias pb-admin='open http://127.0.0.1:8090/_/'
alias pb-test='node scripts/test-pocketbase-connection.js'

# Expo
alias expo-start='npx expo start'
alias expo-clear='npx expo start -c'
alias expo-ios='npx expo start --ios'
alias expo-android='npx expo start --android'
```

### Variables d'environnement rapides

```bash
# Afficher toutes les variables EXPO_PUBLIC
env | grep EXPO_PUBLIC
```

---

## 📖 Ressources

| Ressource | Lien |
|-----------|------|
| Documentation PocketBase | https://pocketbase.io/docs/ |
| SDK JavaScript | https://github.com/pocketbase/js-sdk |
| Discord PocketBase | https://discord.gg/pocketbase |
| Exemples | https://github.com/pocketbase/pocketbase/tree/master/examples |

---

**Dernière mise à jour:** 20 janvier 2026
