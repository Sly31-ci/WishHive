# 🔄 Guide de Migration : PocketBase → Supabase Local

Ce guide vous aide à migrer votre code WishHive de PocketBase vers Supabase Local.

---

## 📋 Table des matières

1. [Différences principales](#différences-principales)
2. [Installation du client Supabase](#installation-du-client-supabase)
3. [Initialisation du client](#initialisation-du-client)
4. [Authentification](#authentification)
5. [Opérations CRUD](#opérations-crud)
6. [Temps réel (Realtime)](#temps-réel-realtime)
7. [Storage (Fichiers)](#storage-fichiers)
8. [Checklist de migration](#checklist-de-migration)

---

## 🔍 Différences principales

| Fonctionnalité | PocketBase | Supabase |
|----------------|------------|----------|
| **Client** | `pocketbase` | `@supabase/supabase-js` |
| **Authentification** | `authStore` | `auth` |
| **Base de données** | Collections | Tables PostgreSQL |
| **Temps réel** | Subscriptions | Realtime Channels |
| **Fichiers** | Files API | Storage API |
| **Sécurité** | Rules | Row Level Security (RLS) |

---

## 📦 Installation du client Supabase

```bash
npm install @supabase/supabase-js
# ou
yarn add @supabase/supabase-js
```

---

## 🔧 Initialisation du client

### Avant (PocketBase)
```javascript
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
```

### Après (Supabase)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Créer un fichier `lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## 🔐 Authentification

### Inscription (Sign Up)

#### Avant (PocketBase)
```javascript
const record = await pb.collection('users').create({
  email: 'user@example.com',
  password: 'password123',
  passwordConfirm: 'password123',
  username: 'username',
});
```

#### Après (Supabase)
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      username: 'username',
    },
  },
});

// Créer le profil utilisateur dans la table users
if (data.user) {
  await supabase.from('users').insert({
    id: data.user.id,
    email: data.user.email,
    username: 'username',
  });
}
```

### Connexion (Sign In)

#### Avant (PocketBase)
```javascript
const authData = await pb.collection('users').authWithPassword(
  'user@example.com',
  'password123'
);
```

#### Après (Supabase)
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

### Déconnexion (Sign Out)

#### Avant (PocketBase)
```javascript
pb.authStore.clear();
```

#### Après (Supabase)
```javascript
await supabase.auth.signOut();
```

### Obtenir l'utilisateur actuel

#### Avant (PocketBase)
```javascript
const user = pb.authStore.model;
const isLoggedIn = pb.authStore.isValid;
```

#### Après (Supabase)
```javascript
const { data: { user } } = await supabase.auth.getUser();

// Ou écouter les changements d'état
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);
});
```

---

## 📊 Opérations CRUD

### Créer (Create)

#### Avant (PocketBase)
```javascript
const record = await pb.collection('wishlists').create({
  title: 'Ma wishlist',
  description: 'Description',
  user_id: pb.authStore.model.id,
});
```

#### Après (Supabase)
```javascript
const { data, error } = await supabase
  .from('wishlists')
  .insert({
    title: 'Ma wishlist',
    description: 'Description',
    user_id: user.id,
  })
  .select()
  .single();
```

### Lire (Read)

#### Avant (PocketBase)
```javascript
// Récupérer tous les enregistrements
const records = await pb.collection('wishlists').getFullList();

// Récupérer un enregistrement par ID
const record = await pb.collection('wishlists').getOne('RECORD_ID');

// Filtrer
const records = await pb.collection('wishlists').getFullList({
  filter: 'user_id = "USER_ID"',
});
```

#### Après (Supabase)
```javascript
// Récupérer tous les enregistrements
const { data, error } = await supabase
  .from('wishlists')
  .select('*');

// Récupérer un enregistrement par ID
const { data, error } = await supabase
  .from('wishlists')
  .select('*')
  .eq('id', 'RECORD_ID')
  .single();

// Filtrer
const { data, error } = await supabase
  .from('wishlists')
  .select('*')
  .eq('user_id', 'USER_ID');
```

### Mettre à jour (Update)

#### Avant (PocketBase)
```javascript
const record = await pb.collection('wishlists').update('RECORD_ID', {
  title: 'Nouveau titre',
});
```

#### Après (Supabase)
```javascript
const { data, error } = await supabase
  .from('wishlists')
  .update({ title: 'Nouveau titre' })
  .eq('id', 'RECORD_ID')
  .select()
  .single();
```

### Supprimer (Delete)

#### Avant (PocketBase)
```javascript
await pb.collection('wishlists').delete('RECORD_ID');
```

#### Après (Supabase)
```javascript
const { error } = await supabase
  .from('wishlists')
  .delete()
  .eq('id', 'RECORD_ID');
```

---

## 🔗 Relations et Jointures

### Avant (PocketBase)
```javascript
const records = await pb.collection('wishlists').getFullList({
  expand: 'wishlist_items,user',
});
```

### Après (Supabase)
```javascript
const { data, error } = await supabase
  .from('wishlists')
  .select(`
    *,
    wishlist_items (*),
    users (*)
  `);
```

---

## ⚡ Temps réel (Realtime)

### Avant (PocketBase)
```javascript
pb.collection('wishlists').subscribe('*', function (e) {
  console.log(e.action); // 'create', 'update', 'delete'
  console.log(e.record);
});

// Se désabonner
pb.collection('wishlists').unsubscribe('*');
```

### Après (Supabase)
```javascript
const channel = supabase
  .channel('wishlists-changes')
  .on(
    'postgres_changes',
    {
      event: '*', // 'INSERT', 'UPDATE', 'DELETE', ou '*'
      schema: 'public',
      table: 'wishlists',
    },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Se désabonner
channel.unsubscribe();
```

---

## 📁 Storage (Fichiers)

### Upload de fichier

#### Avant (PocketBase)
```javascript
const formData = new FormData();
formData.append('avatar', file);

const record = await pb.collection('users').update('USER_ID', formData);
```

#### Après (Supabase)
```javascript
// Upload du fichier
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`public/${userId}/avatar.png`, file);

// Mettre à jour le profil avec l'URL
const { data: publicURL } = supabase.storage
  .from('avatars')
  .getPublicUrl(`public/${userId}/avatar.png`);

await supabase
  .from('users')
  .update({ avatar_url: publicURL.publicUrl })
  .eq('id', userId);
```

### Télécharger un fichier

#### Avant (PocketBase)
```javascript
const url = pb.files.getUrl(record, record.avatar);
```

#### Après (Supabase)
```javascript
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl(`public/${userId}/avatar.png`);

const url = data.publicUrl;
```

### Supprimer un fichier

#### Avant (PocketBase)
```javascript
// Automatique lors de la suppression de l'enregistrement
```

#### Après (Supabase)
```javascript
const { error } = await supabase.storage
  .from('avatars')
  .remove([`public/${userId}/avatar.png`]);
```

---

## ✅ Checklist de migration

### Préparation
- [ ] Installer `@supabase/supabase-js`
- [ ] Créer le fichier `lib/supabase.ts`
- [ ] Mettre à jour le fichier `.env`
- [ ] Créer le schéma de base de données dans Supabase Studio

### Authentification
- [ ] Remplacer `pb.collection('users').create()` par `supabase.auth.signUp()`
- [ ] Remplacer `pb.collection('users').authWithPassword()` par `supabase.auth.signInWithPassword()`
- [ ] Remplacer `pb.authStore.clear()` par `supabase.auth.signOut()`
- [ ] Remplacer `pb.authStore.model` par `supabase.auth.getUser()`
- [ ] Implémenter `onAuthStateChange` pour gérer les changements d'état

### Base de données
- [ ] Remplacer tous les `pb.collection().create()` par `supabase.from().insert()`
- [ ] Remplacer tous les `pb.collection().getFullList()` par `supabase.from().select()`
- [ ] Remplacer tous les `pb.collection().getOne()` par `supabase.from().select().eq().single()`
- [ ] Remplacer tous les `pb.collection().update()` par `supabase.from().update()`
- [ ] Remplacer tous les `pb.collection().delete()` par `supabase.from().delete()`
- [ ] Adapter les filtres et les relations

### Temps réel
- [ ] Remplacer `pb.collection().subscribe()` par `supabase.channel().on()`
- [ ] Adapter les callbacks pour le nouveau format de payload

### Storage
- [ ] Créer les buckets dans Supabase Studio
- [ ] Remplacer `pb.files.getUrl()` par `supabase.storage.getPublicUrl()`
- [ ] Adapter les uploads de fichiers

### Tests
- [ ] Tester l'authentification (signup, signin, signout)
- [ ] Tester les opérations CRUD sur chaque table
- [ ] Tester les relations et jointures
- [ ] Tester le temps réel
- [ ] Tester l'upload/download de fichiers

---

## 🎯 Exemple complet de migration

### Avant (PocketBase)
```typescript
// lib/pocketbase.ts
import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

// services/wishlist-service.ts
export async function createWishlist(title: string, description: string) {
  const record = await pb.collection('wishlists').create({
    title,
    description,
    user_id: pb.authStore.model.id,
  });
  return record;
}

export async function getWishlists() {
  const records = await pb.collection('wishlists').getFullList({
    expand: 'wishlist_items',
  });
  return records;
}
```

### Après (Supabase)
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// services/wishlist-service.ts
import { supabase } from '../lib/supabase';

export async function createWishlist(title: string, description: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('wishlists')
    .insert({
      title,
      description,
      user_id: user?.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getWishlists() {
  const { data, error } = await supabase
    .from('wishlists')
    .select(`
      *,
      wishlist_items (*)
    `);
  
  if (error) throw error;
  return data;
}
```

---

## 📚 Ressources

- **Documentation Supabase** : https://supabase.com/docs
- **Supabase JS Client** : https://supabase.com/docs/reference/javascript
- **Supabase Auth** : https://supabase.com/docs/guides/auth
- **Supabase Realtime** : https://supabase.com/docs/guides/realtime
- **Supabase Storage** : https://supabase.com/docs/guides/storage

---

**Bon courage pour la migration ! 🚀**
