# Configuration Supabase Local pour WishHive

## 🎉 Supabase Local est maintenant opérationnel !

Votre instance Supabase locale est configurée et fonctionne. Voici toutes les informations dont vous avez besoin.

## 📍 URLs d'accès

- **Supabase Studio** (Interface d'administration): http://localhost:3000
  - Accès direct au dashboard WishHive Local
  - Pas de login requis pour l'instance locale

- **API Gateway (Kong)**: http://localhost:8000
- **PostgreSQL Database**: localhost:5432
- **Analytics**: http://localhost:4000

## 🔑 Clés API

Pour votre application WishHive, utilisez ces clés :

```env
# Supabase Configuration
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzY4OTE1NzMxLCJleHAiOjIwODQyNzU3MzF9.hngs38z7DMyaERLwxNEl0x-u8ThSJgZMKt_4dPl0ug8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3Njg5MTU3MzEsImV4cCI6MjA4NDI3NTczMX0.iH0GMJ1gP-wOsSVpVAr0DDbhlTnYtDCdqCPdH2XqhzM
```

## 🗄️ Connexion PostgreSQL

Si vous souhaitez vous connecter directement à la base de données :

```bash
# Via psql
psql postgresql://postgres:bDeXdxrmmJ+18a8qzVmZ2YEBDV1ioAGL@localhost:5432/postgres

# Ou via une URL de connexion
postgresql://postgres:bDeXdxrmmJ+18a8qzVmZ2YEBDV1ioAGL@localhost:5432/postgres
```

## 🚀 Commandes utiles

### Démarrer Supabase
```bash
cd ~/projects/supabase-local/supabase/docker
docker compose up -d
```

### Arrêter Supabase
```bash
cd ~/projects/supabase-local/supabase/docker
docker compose down
```

### Voir les logs
```bash
cd ~/projects/supabase-local/supabase/docker
docker compose logs -f
```

### Redémarrer un service spécifique
```bash
cd ~/projects/supabase-local/supabase/docker
docker compose restart [service-name]
# Exemples: studio, db, auth, storage, etc.
```

### Réinitialiser complètement (⚠️ ATTENTION: Supprime toutes les données)
```bash
cd ~/projects/supabase-local/supabase/docker
./reset.sh
```

## 📊 Prochaines étapes

### 1. Accéder à Supabase Studio

Ouvrez votre navigateur et allez sur http://localhost:54323

Connectez-vous avec :
- Username: `supabase`
- Password: `P0jd3y/1bptBC/CA8fKmomKr`

### 2. Créer le schéma de base de données WishHive

Vous avez deux options :

#### Option A: Importer depuis votre schéma existant
Si vous avez déjà un dump SQL de votre base Supabase cloud :

```bash
psql postgresql://postgres:bDeXdxrmmJ+18a8qzVmZ2YEBDV1ioAGL@localhost:5432/postgres < votre_schema.sql
```

#### Option B: Créer manuellement via Studio
1. Allez dans l'onglet "SQL Editor" dans Studio
2. Créez vos tables, relations, et politiques RLS

### 3. Mettre à jour votre fichier .env WishHive

Mettez à jour `/home/syzon/Téléchargements/WishHive/.env` avec les nouvelles valeurs :

```env
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzY4OTE1NzMxLCJleHAiOjIwODQyNzU3MzF9.hngs38z7DMyaERLwxNEl0x-u8ThSJgZMKt_4dPl0ug8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3Njg5MTU3MzEsImV4cCI6MjA4NDI3NTczMX0.iH0GMJ1gP-wOsSVpVAr0DDbhlTnYtDCdqCPdH2XqhzM
```

### 4. Tester la connexion

Créez un script de test pour vérifier que tout fonctionne :

```javascript
// test-supabase-connection.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://localhost:8000';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzY4OTE1NzMxLCJleHAiOjIwODQyNzU3MzF9.hngs38z7DMyaERLwxNEl0x-u8ThSJgZMKt_4dPl0ug8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  // Test simple query
  const { data, error } = await supabase.from('_test').select('*').limit(1);
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist, which is OK
    console.error('❌ Connection failed:', error);
  } else {
    console.log('✅ Connection successful!');
  }
}

testConnection();
```

## 🔒 Sécurité

⚠️ **IMPORTANT**: Ces secrets sont générés pour un environnement de développement local uniquement.

- **NE PAS** utiliser ces secrets en production
- **NE PAS** commiter le fichier `.env` dans Git
- Pour la production, générez de nouveaux secrets sécurisés

## 📚 Documentation

- [Documentation Supabase](https://supabase.com/docs)
- [Self-Hosting Guide](https://supabase.com/docs/guides/self-hosting/docker)
- [API Reference](https://supabase.com/docs/reference)

## 🐛 Dépannage

### Les services ne démarrent pas
```bash
# Vérifier les logs
cd ~/projects/supabase-local/supabase/docker
docker compose logs

# Redémarrer tous les services
docker compose restart
```

### Problème de port déjà utilisé
Si le port 8000 ou 5432 est déjà utilisé :

1. Modifiez le fichier `.env` :
```env
KONG_HTTP_PORT=8001  # Au lieu de 8000
POSTGRES_PORT=5433   # Au lieu de 5432
```

2. Redémarrez :
```bash
docker compose down
docker compose up -d
```

### Réinitialiser complètement
```bash
cd ~/projects/supabase-local/supabase/docker
docker compose down -v
rm -rf volumes/db/data/*
docker compose up -d
```

## 📝 Notes

- Les données sont persistées dans `~/projects/supabase-local/supabase/docker/volumes/`
- Les sauvegardes automatiques ne sont pas configurées par défaut
- Pour la production, configurez des sauvegardes régulières de PostgreSQL

---

**Date de création**: 2026-01-20  
**Version Supabase**: Latest (Docker)  
**Projet**: WishHive
