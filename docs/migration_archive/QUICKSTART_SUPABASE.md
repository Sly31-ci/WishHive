# 🚀 Guide de Démarrage Rapide - Supabase Local pour WishHive

## ✅ Étape 1 : Vérifier que Supabase est démarré

```bash
cd ~/projects/supabase-local/supabase/docker
docker compose ps
```

Tous les services doivent être **healthy** ou **Up**.

Si ce n'est pas le cas, démarrez-les :
```bash
docker compose up -d
```

## ✅ Étape 2 : Accéder à Supabase Studio

Ouvrez votre navigateur et allez sur : **http://localhost:3000**

Vous devriez voir le dashboard "WishHive Local" avec :
- Table Editor (0 tables pour le moment)
- SQL Editor
- Database
- Authentication
- Storage
- Edge Functions
- etc.

## ✅ Étape 3 : Créer le schéma de base de données WishHive

### Option A : Via l'interface SQL Editor

1. Dans Supabase Studio, cliquez sur **"SQL Editor"** dans la sidebar
2. Cliquez sur **"New query"**
3. Copiez-collez le schéma SQL ci-dessous
4. Cliquez sur **"Run"**

### Schéma de base WishHive

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Table: users (profiles utilisateurs)
-- ========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- Table: wishlists
-- ========================================
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  theme JSONB DEFAULT '{"primary": "#FFB937", "secondary": "#7F5BFF"}'::jsonb,
  is_public BOOLEAN DEFAULT true,
  event_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_is_public ON public.wishlists(is_public);

-- ========================================
-- Table: wishlist_items
-- ========================================
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  url TEXT,
  image_url TEXT,
  priority INTEGER DEFAULT 0,
  is_reserved BOOLEAN DEFAULT false,
  reserved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reserved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist_id ON public.wishlist_items(wishlist_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_reserved_by ON public.wishlist_items(reserved_by);

-- ========================================
-- Table: follows (abonnements entre utilisateurs)
-- ========================================
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);

-- ========================================
-- Table: notifications
-- ========================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- ========================================
-- Row Level Security (RLS) Policies
-- ========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users: Les utilisateurs peuvent voir tous les profils publics
CREATE POLICY "Users are viewable by everyone" 
  ON public.users FOR SELECT 
  USING (true);

-- Users: Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- Wishlists: Les wishlists publiques sont visibles par tous
CREATE POLICY "Public wishlists are viewable by everyone" 
  ON public.wishlists FOR SELECT 
  USING (is_public = true OR user_id = auth.uid());

-- Wishlists: Les utilisateurs peuvent créer leurs propres wishlists
CREATE POLICY "Users can create own wishlists" 
  ON public.wishlists FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Wishlists: Les utilisateurs peuvent mettre à jour leurs propres wishlists
CREATE POLICY "Users can update own wishlists" 
  ON public.wishlists FOR UPDATE 
  USING (auth.uid() = user_id);

-- Wishlists: Les utilisateurs peuvent supprimer leurs propres wishlists
CREATE POLICY "Users can delete own wishlists" 
  ON public.wishlists FOR DELETE 
  USING (auth.uid() = user_id);

-- Wishlist Items: Visibles si la wishlist est accessible
CREATE POLICY "Wishlist items are viewable if wishlist is accessible" 
  ON public.wishlist_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists 
      WHERE id = wishlist_id 
      AND (is_public = true OR user_id = auth.uid())
    )
  );

-- Wishlist Items: Les propriétaires peuvent gérer leurs items
CREATE POLICY "Users can manage own wishlist items" 
  ON public.wishlist_items FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists 
      WHERE id = wishlist_id 
      AND user_id = auth.uid()
    )
  );

-- Follows: Tout le monde peut voir les abonnements
CREATE POLICY "Follows are viewable by everyone" 
  ON public.follows FOR SELECT 
  USING (true);

-- Follows: Les utilisateurs peuvent créer leurs propres abonnements
CREATE POLICY "Users can create own follows" 
  ON public.follows FOR INSERT 
  WITH CHECK (auth.uid() = follower_id);

-- Follows: Les utilisateurs peuvent supprimer leurs propres abonnements
CREATE POLICY "Users can delete own follows" 
  ON public.follows FOR DELETE 
  USING (auth.uid() = follower_id);

-- Notifications: Les utilisateurs peuvent voir leurs propres notifications
CREATE POLICY "Users can view own notifications" 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

-- Notifications: Les utilisateurs peuvent mettre à jour leurs propres notifications
CREATE POLICY "Users can update own notifications" 
  ON public.notifications FOR UPDATE 
  USING (auth.uid() = user_id);

-- ========================================
-- Functions et Triggers
-- ========================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wishlists_updated_at 
  BEFORE UPDATE ON public.wishlists 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wishlist_items_updated_at 
  BEFORE UPDATE ON public.wishlist_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Données de test (optionnel)
-- ========================================

-- Créer un utilisateur de test
INSERT INTO public.users (id, email, username, display_name, bio)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'test@wishhive.com', 'testuser', 'Test User', 'Utilisateur de test WishHive')
ON CONFLICT (email) DO NOTHING;

-- Créer une wishlist de test
INSERT INTO public.wishlists (id, user_id, title, description, is_public)
VALUES 
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Ma première wishlist', 'Liste de souhaits de test', true)
ON CONFLICT (id) DO NOTHING;

-- Créer quelques items de test
INSERT INTO public.wishlist_items (wishlist_id, title, description, price, priority)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'Livre de développement', 'Un bon livre sur React Native', 29.99, 1),
  ('00000000-0000-0000-0000-000000000002', 'Casque audio', 'Casque Bluetooth avec réduction de bruit', 199.99, 2),
  ('00000000-0000-0000-0000-000000000002', 'Clavier mécanique', 'Clavier gaming RGB', 149.99, 3)
ON CONFLICT DO NOTHING;
```

## ✅ Étape 4 : Vérifier que tout fonctionne

1. Allez dans **"Table Editor"** dans la sidebar
2. Vous devriez voir 6 tables :
   - users
   - wishlists
   - wishlist_items
   - follows
   - notifications

3. Cliquez sur la table **"users"** pour voir l'utilisateur de test
4. Cliquez sur la table **"wishlists"** pour voir la wishlist de test
5. Cliquez sur la table **"wishlist_items"** pour voir les 3 items de test

## ✅ Étape 5 : Configurer l'authentification

1. Dans Supabase Studio, allez dans **"Authentication"** > **"Providers"**
2. Activez **"Email"** (déjà activé par défaut)
3. Pour les tests locaux, vous pouvez désactiver la confirmation d'email :
   - Allez dans **"Authentication"** > **"Settings"**
   - Désactivez **"Enable email confirmations"**

## ✅ Étape 6 : Tester la connexion depuis votre application

Créez un fichier de test dans votre projet WishHive :

```bash
cd ~/Téléchargements/WishHive
```

Créez `test-supabase.js` :

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://localhost:8000';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzY4OTE1NzMxLCJleHAiOjIwODQyNzU3MzF9.hngs38z7DMyaERLwxNEl0x-u8ThSJgZMKt_4dPl0ug8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Test de connexion à Supabase...\n');
  
  // Test 1: Récupérer les utilisateurs
  console.log('📋 Test 1: Récupération des utilisateurs');
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*');
  
  if (usersError) {
    console.error('❌ Erreur:', usersError);
  } else {
    console.log('✅ Succès! Utilisateurs trouvés:', users.length);
    console.log(users);
  }
  
  // Test 2: Récupérer les wishlists
  console.log('\n📋 Test 2: Récupération des wishlists');
  const { data: wishlists, error: wishlistsError } = await supabase
    .from('wishlists')
    .select('*');
  
  if (wishlistsError) {
    console.error('❌ Erreur:', wishlistsError);
  } else {
    console.log('✅ Succès! Wishlists trouvées:', wishlists.length);
    console.log(wishlists);
  }
  
  // Test 3: Récupérer les items
  console.log('\n📋 Test 3: Récupération des items');
  const { data: items, error: itemsError } = await supabase
    .from('wishlist_items')
    .select('*');
  
  if (itemsError) {
    console.error('❌ Erreur:', itemsError);
  } else {
    console.log('✅ Succès! Items trouvés:', items.length);
    console.log(items);
  }
  
  console.log('\n🎉 Tests terminés!');
}

testConnection();
```

Exécutez le test :

```bash
node test-supabase.js
```

Vous devriez voir :
```
🔍 Test de connexion à Supabase...

📋 Test 1: Récupération des utilisateurs
✅ Succès! Utilisateurs trouvés: 1

📋 Test 2: Récupération des wishlists
✅ Succès! Wishlists trouvées: 1

📋 Test 3: Récupération des items
✅ Succès! Items trouvés: 3

🎉 Tests terminés!
```

## 🎯 Prochaines étapes

1. **Migrer votre code existant** pour utiliser Supabase au lieu de PocketBase/Firebase
2. **Configurer l'authentification** dans votre application mobile
3. **Implémenter les fonctionnalités** de wishlists, items, etc.
4. **Tester en temps réel** les fonctionnalités de Supabase Realtime

## 📚 Ressources utiles

- **Documentation complète** : `/home/syzon/Téléchargements/WishHive/SUPABASE_LOCAL_SETUP.md`
- **Supabase Docs** : https://supabase.com/docs
- **Supabase JS Client** : https://supabase.com/docs/reference/javascript

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifiez que tous les services Docker sont en cours d'exécution :
   ```bash
   cd ~/projects/supabase-local/supabase/docker
   docker compose ps
   ```

2. Consultez les logs :
   ```bash
   docker compose logs -f
   ```

3. Redémarrez les services si nécessaire :
   ```bash
   docker compose restart
   ```

---

**Bon développement avec Supabase ! 🚀**
