# 🔄 Guide de Migration : Supabase Cloud → Supabase Local

**Date** : 2026-01-20  
**Objectif** : Migrer toutes les données de Supabase Cloud vers Supabase Local

---

## 📋 Méthodes de migration

Il existe **3 méthodes** pour migrer vos données :

### Méthode 1 : Export/Import SQL (Recommandée) ⭐
- ✅ Migre le schéma ET les données
- ✅ Rapide et fiable
- ✅ Préserve les relations et contraintes
- ⚠️ Nécessite accès direct à PostgreSQL

### Méthode 2 : Script de migration via API
- ✅ Fonctionne avec les clés API uniquement
- ✅ Contrôle granulaire
- ⚠️ Plus lent pour beaucoup de données
- ⚠️ Nécessite de recréer le schéma manuellement

### Méthode 3 : Backup/Restore Supabase
- ✅ Méthode officielle Supabase
- ✅ Migre tout (schéma, données, storage, auth)
- ⚠️ Nécessite Supabase CLI
- ⚠️ Plus complexe

---

## 🎯 Méthode 1 : Export/Import SQL (Recommandée)

### Prérequis
- Accès à Supabase Cloud Dashboard
- PostgreSQL installé localement (pour `pg_dump` et `psql`)
- Supabase Local en cours d'exécution

### Étape 1 : Installer PostgreSQL client (si nécessaire)

```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# Vérifier l'installation
psql --version
```

### Étape 2 : Récupérer les informations de connexion Supabase Cloud

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet WishHive
3. Allez dans **Settings** > **Database**
4. Notez les informations de connexion :
   - **Host** : `db.nydtsqjlbiwuoakqrldr.supabase.co`
   - **Database name** : `postgres`
   - **Port** : `5432`
   - **User** : `postgres`
   - **Password** : (cliquez sur "Reset database password" si vous ne l'avez pas)

### Étape 3 : Exporter le schéma et les données

```bash
# Créer un dossier pour les backups
mkdir -p ~/supabase-migration
cd ~/supabase-migration

# Exporter TOUT (schéma + données)
pg_dump \
  --host=db.nydtsqjlbiwuoakqrldr.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  --file=supabase_cloud_full_backup.sql

# Ou exporter uniquement le schéma public (sans les tables système Supabase)
pg_dump \
  --host=db.nydtsqjlbiwuoakqrldr.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --schema=public \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  --file=supabase_cloud_public_schema.sql
```

**Note** : Vous serez invité à entrer le mot de passe de la base de données.

### Étape 4 : Nettoyer le fichier SQL (optionnel mais recommandé)

Le fichier exporté peut contenir des références à des extensions ou des rôles spécifiques à Supabase Cloud. Nettoyons-le :

```bash
# Créer une copie de sauvegarde
cp supabase_cloud_public_schema.sql supabase_cloud_public_schema_original.sql

# Supprimer les lignes problématiques
sed -i '/^SET /d' supabase_cloud_public_schema.sql
sed -i '/^SELECT pg_catalog.set_config/d' supabase_cloud_public_schema.sql
```

### Étape 5 : Importer dans Supabase Local

```bash
# S'assurer que Supabase Local est démarré
cd ~/projects/supabase-local/supabase/docker
docker compose ps

# Importer le schéma et les données
psql \
  --host=localhost \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --file=~/supabase-migration/supabase_cloud_public_schema.sql

# Mot de passe : bDeXdxrmmJ+18a8qzVmZ2YEBDV1ioAGL
```

### Étape 6 : Vérifier l'importation

```bash
# Se connecter à la base locale
psql postgresql://postgres:bDeXdxrmmJ+18a8qzVmZ2YEBDV1ioAGL@localhost:5432/postgres

# Lister les tables
\dt

# Compter les enregistrements dans chaque table
SELECT 
    schemaname,
    tablename,
    n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;

# Quitter
\q
```

---

## 🎯 Méthode 2 : Script de migration via API

Si vous n'avez pas accès direct à PostgreSQL, utilisez cette méthode.

### Étape 1 : Créer le fichier de configuration

Créez un fichier `.env.migration` :

```env
# Supabase Cloud
CLOUD_SUPABASE_URL=https://nydtsqjlbiwuoakqrldr.supabase.co
CLOUD_SUPABASE_SERVICE_KEY=votre_service_role_key_cloud

# Supabase Local
LOCAL_SUPABASE_URL=http://localhost:8000
LOCAL_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3Njg5MTU3MzEsImV4cCI6MjA4NDI3NTczMX0.iH0GMJ1gP-wOsSVpVAr0DDbhlTnYtDCdqCPdH2XqhzM
```

### Étape 2 : Utiliser le script de migration

J'ai créé un script complet : `scripts/migrate-supabase-data.js`

Exécutez-le :

```bash
cd ~/Téléchargements/WishHive
node scripts/migrate-supabase-data.js
```

---

## 🎯 Méthode 3 : Supabase CLI

### Étape 1 : Installer Supabase CLI

```bash
npm install -g supabase
```

### Étape 2 : Lier votre projet Cloud

```bash
cd ~/Téléchargements/WishHive
supabase login
supabase link --project-ref nydtsqjlbiwuoakqrldr
```

### Étape 3 : Générer les migrations

```bash
# Générer les migrations depuis le cloud
supabase db pull

# Les migrations seront dans supabase/migrations/
```

### Étape 4 : Appliquer à Supabase Local

```bash
# Appliquer les migrations à la base locale
supabase db push --db-url postgresql://postgres:bDeXdxrmmJ+18a8qzVmZ2YEBDV1ioAGL@localhost:5432/postgres
```

---

## 📊 Migration du Storage (fichiers)

Si vous avez des fichiers uploadés dans Supabase Storage :

### Option 1 : Téléchargement manuel via Dashboard

1. Allez sur https://supabase.com/dashboard
2. **Storage** > Sélectionnez votre bucket
3. Téléchargez tous les fichiers
4. Uploadez-les dans Supabase Local Studio (http://localhost:3000)

### Option 2 : Script de migration Storage

Utilisez le script : `scripts/migrate-supabase-storage.js`

```bash
node scripts/migrate-supabase-storage.js
```

---

## ✅ Checklist de migration

### Avant la migration
- [ ] Supabase Local est démarré et accessible
- [ ] Vous avez les credentials Supabase Cloud
- [ ] Vous avez créé un dossier de backup
- [ ] Vous avez installé PostgreSQL client (pour méthode 1)

### Pendant la migration
- [ ] Export du schéma et des données réussi
- [ ] Fichier SQL nettoyé (si nécessaire)
- [ ] Import dans Supabase Local réussi
- [ ] Vérification des tables et données

### Après la migration
- [ ] Toutes les tables sont présentes
- [ ] Le nombre d'enregistrements correspond
- [ ] Les relations fonctionnent
- [ ] Les politiques RLS sont actives
- [ ] Les fichiers Storage sont migrés (si applicable)
- [ ] Test de l'application avec Supabase Local

---

## 🔍 Vérification post-migration

### Vérifier les tables

```sql
-- Lister toutes les tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Compter les enregistrements
SELECT 
    tablename,
    n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public';
```

### Vérifier les politiques RLS

```sql
-- Lister les politiques RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public';
```

### Tester avec l'application

```bash
cd ~/Téléchargements/WishHive
node test-supabase.js
```

---

## ⚠️ Problèmes courants

### Erreur : "role does not exist"

**Solution** : Supprimez les lignes `SET ROLE` du fichier SQL :

```bash
sed -i '/SET ROLE/d' supabase_cloud_public_schema.sql
```

### Erreur : "extension already exists"

**Solution** : Ajoutez `IF NOT EXISTS` ou supprimez les lignes `CREATE EXTENSION` :

```bash
sed -i 's/CREATE EXTENSION/CREATE EXTENSION IF NOT EXISTS/g' supabase_cloud_public_schema.sql
```

### Les données ne s'importent pas

**Vérification** :
1. Vérifiez que le schéma est créé avant les données
2. Vérifiez les contraintes de clés étrangères
3. Désactivez temporairement les triggers si nécessaire

---

## 📚 Ressources

- **Documentation pg_dump** : https://www.postgresql.org/docs/current/app-pgdump.html
- **Documentation Supabase CLI** : https://supabase.com/docs/guides/cli
- **Supabase Migrations** : https://supabase.com/docs/guides/cli/local-development

---

## 🎯 Prochaines étapes

Après la migration réussie :

1. **Tester l'application** avec Supabase Local
2. **Vérifier toutes les fonctionnalités**
3. **Mettre à jour la documentation**
4. **Créer des sauvegardes régulières**

---

**Bon courage pour la migration ! 🚀**

Si vous rencontrez des problèmes, consultez la section "Problèmes courants" ou créez un backup avant de réessayer.
