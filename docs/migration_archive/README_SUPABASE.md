# 📚 Documentation Supabase Local - WishHive

Bienvenue dans la documentation complète pour l'utilisation de Supabase Local avec WishHive !

---

## 🎯 Par où commencer ?

### Vous venez d'installer Supabase ?
👉 **Commencez ici** : [`QUICKSTART_SUPABASE.md`](./QUICKSTART_SUPABASE.md)

### Vous voulez comprendre ce qui a été fait ?
👉 **Lisez le récapitulatif** : [`RECAP_INSTALLATION_SUPABASE.md`](./RECAP_INSTALLATION_SUPABASE.md)

### Vous migrez depuis PocketBase ?
👉 **Suivez le guide de migration** : [`GUIDE_MIGRATION_POCKETBASE_TO_SUPABASE.md`](./GUIDE_MIGRATION_POCKETBASE_TO_SUPABASE.md)

### Vous cherchez une référence complète ?
👉 **Consultez la documentation** : [`SUPABASE_LOCAL_SETUP.md`](./SUPABASE_LOCAL_SETUP.md)

---

## 📖 Liste des documents

### 🚀 Démarrage rapide
**[`QUICKSTART_SUPABASE.md`](./QUICKSTART_SUPABASE.md)** (14 KB)
- Guide pas à pas pour démarrer avec Supabase
- Création du schéma de base de données
- Configuration de l'authentification
- Script de test de connexion
- **Recommandé pour débuter !**

### 📋 Récapitulatif d'installation
**[`RECAP_INSTALLATION_SUPABASE.md`](./RECAP_INSTALLATION_SUPABASE.md)** (7 KB)
- Résumé de tout ce qui a été accompli
- URLs et clés d'accès
- Commandes utiles
- Checklist de validation
- Prochaines étapes

### 📘 Documentation complète
**[`SUPABASE_LOCAL_SETUP.md`](./SUPABASE_LOCAL_SETUP.md)** (5.6 KB)
- Configuration détaillée de Supabase Local
- Informations de connexion
- Commandes Docker Compose
- Dépannage
- Sécurité et bonnes pratiques

### 🔄 Guide de migration
**[`GUIDE_MIGRATION_POCKETBASE_TO_SUPABASE.md`](./GUIDE_MIGRATION_POCKETBASE_TO_SUPABASE.md)** (12 KB)
- Migration du code PocketBase vers Supabase
- Exemples avant/après pour chaque opération
- Authentification, CRUD, Realtime, Storage
- Checklist complète de migration
- **Essentiel si vous migrez depuis PocketBase !**

### 🧪 Script de test
**[`test-supabase.js`](./test-supabase.js)** (4.4 KB)
- Script Node.js pour tester la connexion
- Teste les opérations de base (SELECT, jointures)
- Affiche des messages d'erreur détaillés
- **Exécutez-le pour vérifier que tout fonctionne !**

---

## 🎯 Flux de travail recommandé

### 1️⃣ Installation (Déjà fait ✅)
- [x] Supabase Local installé
- [x] Services Docker démarrés
- [x] Studio accessible sur http://localhost:3000
- [x] Configuration WishHive mise à jour

### 2️⃣ Configuration de la base de données
📖 Suivez : [`QUICKSTART_SUPABASE.md`](./QUICKSTART_SUPABASE.md) - Étape 3

1. Ouvrir http://localhost:3000
2. Aller dans "SQL Editor"
3. Exécuter le schéma SQL fourni
4. Vérifier que les tables sont créées

### 3️⃣ Test de connexion
📖 Suivez : [`QUICKSTART_SUPABASE.md`](./QUICKSTART_SUPABASE.md) - Étape 6

```bash
cd ~/Téléchargements/WishHive
node test-supabase.js
```

### 4️⃣ Migration du code
📖 Suivez : [`GUIDE_MIGRATION_POCKETBASE_TO_SUPABASE.md`](./GUIDE_MIGRATION_POCKETBASE_TO_SUPABASE.md)

1. Installer `@supabase/supabase-js`
2. Créer `lib/supabase.ts`
3. Migrer l'authentification
4. Migrer les opérations CRUD
5. Tester chaque fonctionnalité

### 5️⃣ Développement
- Utiliser Supabase Studio pour gérer la base de données
- Consulter les logs avec `docker compose logs -f`
- Tester en temps réel avec Supabase Realtime

---

## 🔗 Liens rapides

### URLs d'accès
- **Supabase Studio** : http://localhost:3000
- **API Gateway** : http://localhost:8000
- **PostgreSQL** : localhost:5432
- **Analytics** : http://localhost:4000

### Commandes Docker
```bash
# Démarrer Supabase
cd ~/projects/supabase-local/supabase/docker
docker compose up -d

# Arrêter Supabase
docker compose down

# Voir les logs
docker compose logs -f

# Vérifier l'état
docker compose ps
```

### Configuration (.env)
```env
EXPO_PUBLIC_SUPABASE_URL=http://localhost:8000
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📚 Ressources externes

### Documentation officielle Supabase
- **Documentation générale** : https://supabase.com/docs
- **JavaScript Client** : https://supabase.com/docs/reference/javascript
- **Authentication** : https://supabase.com/docs/guides/auth
- **Database** : https://supabase.com/docs/guides/database
- **Realtime** : https://supabase.com/docs/guides/realtime
- **Storage** : https://supabase.com/docs/guides/storage
- **Self-Hosting** : https://supabase.com/docs/guides/self-hosting/docker

### Tutoriels et guides
- **Getting Started** : https://supabase.com/docs/guides/getting-started
- **React Native** : https://supabase.com/docs/guides/getting-started/tutorials/with-react-native
- **Row Level Security** : https://supabase.com/docs/guides/auth/row-level-security

---

## 🆘 Besoin d'aide ?

### Problèmes courants

#### Les services ne démarrent pas
```bash
cd ~/projects/supabase-local/supabase/docker
docker compose logs
docker compose restart
```

#### Impossible de se connecter à Studio
- Vérifiez que le port 3000 n'est pas utilisé
- Essayez http://127.0.0.1:3000 au lieu de localhost
- Vérifiez que le service studio est "healthy" : `docker compose ps`

#### Erreur de connexion à la base de données
- Vérifiez que le service db est "healthy"
- Vérifiez les credentials dans le fichier .env
- Consultez les logs : `docker compose logs db`

#### Les tables n'existent pas
- Assurez-vous d'avoir exécuté le schéma SQL dans Studio
- Vérifiez dans "Table Editor" que les tables sont créées
- Consultez les erreurs dans "SQL Editor"

### Où trouver de l'aide ?
1. **Documentation locale** : Consultez les fichiers .md de ce dossier
2. **Documentation Supabase** : https://supabase.com/docs
3. **Discord Supabase** : https://discord.supabase.com
4. **GitHub Discussions** : https://github.com/supabase/supabase/discussions

---

## ✅ Checklist de vérification

Avant de commencer le développement, assurez-vous que :

- [ ] Supabase est démarré (`docker compose ps` montre tous les services "healthy")
- [ ] Studio est accessible sur http://localhost:3000
- [ ] Le schéma de base de données est créé (6 tables visibles dans Studio)
- [ ] Le fichier `.env` de WishHive est mis à jour
- [ ] Le script `test-supabase.js` s'exécute sans erreur
- [ ] Vous avez lu le guide de migration si vous venez de PocketBase

---

## 📝 Notes importantes

### Sécurité
⚠️ **Les secrets générés sont pour le développement local uniquement**
- NE PAS utiliser en production
- NE PAS commiter le fichier `.env` dans Git
- Générer de nouveaux secrets pour la production

### Performance
- Les données sont persistées dans `volumes/db/data/`
- Pensez à configurer des sauvegardes pour la production
- Utilisez les index pour optimiser les requêtes

### Développement mobile
- Pour tester sur un appareil physique, utilisez l'IP de votre machine
- Ou configurez un tunnel (ngrok, etc.)
- Mettez à jour `EXPO_PUBLIC_SUPABASE_URL` en conséquence

---

## 🎉 Vous êtes prêt !

Tout est configuré et prêt à l'emploi. Commencez par :

1. **Lire** [`QUICKSTART_SUPABASE.md`](./QUICKSTART_SUPABASE.md)
2. **Exécuter** `node test-supabase.js`
3. **Migrer** votre code avec [`GUIDE_MIGRATION_POCKETBASE_TO_SUPABASE.md`](./GUIDE_MIGRATION_POCKETBASE_TO_SUPABASE.md)

**Bon développement ! 🚀**

---

**Dernière mise à jour** : 2026-01-20  
**Version Supabase** : Latest (Docker)  
**Projet** : WishHive
