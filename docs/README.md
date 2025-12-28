# 🎁 WishHive - Wishlists Publiques via GitHub Pages

## 📋 Configuration Complète

### 1️⃣ Activer GitHub Pages

1. Aller sur votre repo GitHub : `https://github.com/<votre-username>/WishHive`
2. Settings → Pages
3. Source : **Deploy from a branch**
4. Branch : **main** (ou master)
5. Folder : **/docs**
6. Save

**URL publique** : `https://<votre-username>.github.io/WishHive`

---

### 2️⃣ Configuration Supabase

#### A. Obtenir vos clés

1. Aller sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionner votre projet WishHive
3. Settings → API
4. Copier :
   - `Project URL` (SUPABASE_URL)
   - `anon public` key (SUPABASE_ANON_KEY)

#### B. Mettre à jour `docs/w/index.html`

Ligne 251-252, remplacer :
```javascript
const SUPABASE_URL = 'https://VOTRE_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

#### C. Configurer RLS (Row Level Security)

**IMPORTANT** : Exécuter ces requêtes SQL dans Supabase SQL Editor :

```sql
-- 1️⃣ Activer RLS sur les tables
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2️⃣ Politique : Lecture publique des wishlists publiques
CREATE POLICY "Public wishlists are viewable by anyone"
ON wishlists FOR SELECT
USING (privacy = 'public');

-- 3️⃣ Politique : Lecture des items de wishlists publiques
CREATE POLICY "Public wishlist items are viewable"
ON wishlist_items FOR SELECT
USING (
  wishlist_id IN (
    SELECT id FROM wishlists WHERE privacy = 'public'
  )
);

-- 4️⃣ Politique : Lecture des produits liés
CREATE POLICY "Products in public wishlists are viewable"
ON products FOR SELECT
USING (
  id IN (
    SELECT product_id FROM wishlist_items 
    WHERE wishlist_id IN (
      SELECT id FROM wishlists WHERE privacy = 'public'
    )
  )
);

-- 5️⃣ Vérification
SELECT * FROM wishlists WHERE privacy = 'public'; -- Doit fonctionner
```

---

### 3️⃣ Intégration App Mobile

#### A. Génération de lien

Dans `components/ShareWishlistButton.tsx` ou équivalent :

```typescript
// Récupérer votre GitHub username
const GITHUB_USERNAME = 'votre-username'; // À configurer
const REPO_NAME = 'WishHive';

// Générer le lien public
const generatePublicLink = (wishlistId: string) => {
  return `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/w/?id=${wishlistId}`;
};

// Utilisation dans ShareWishlistButton
const publicUrl = generatePublicLink(wishlist.id);

// Partage
await Share.share({
  message: `Découvre ma wishlist : ${publicUrl}`,
  url: publicUrl,
});
```

#### B. Configuration Deep Linking

Dans `app.json` :

```json
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
              "host": "<votre-username>.github.io",
              "pathPrefix": "/WishHive/w"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    "ios": {
      "associatedDomains": [
        "applinks:<votre-username>.github.io"
      ]
    }
  }
}
```

---

### 4️⃣ Test Local (Avant Deploy)

```bash
# Servir le dossier docs localement
cd docs
python3 -m http.server 8000

# Ou avec Node.js
npx serve docs

# Ouvrir dans le navigateur
http://localhost:8000/w/?id=VOTRE_WISHLIST_ID_TEST
```

---

### 5️⃣ Déploiement

```bash
# 1. Commit les fichiers
git add docs/
git commit -m "Add GitHub Pages for public wishlists"

# 2. Push
git push origin main

# 3. Attendre 1-2 minutes
# GitHub Pages déploie automatiquement

# 4. Tester
# https://<votre-username>.github.io/WishHive/w/?id=VOTRE_WISHLIST_ID
```

---

### 6️⃣ URLs Finales

| Type | URL |
|------|-----|
| **Home** | `https://<username>.github.io/WishHive/` |
| **Wishlist** | `https://<username>.github.io/WishHive/w/?id=<wishlist-id>` |
| **Deep Link** | `wishhive://wishlists/<wishlist-id>` |

---

### 7️⃣ Sécurité - Checklist

- ✅ Utiliser uniquement la clé `anon` publique
- ✅ Jamais exposer la clé `service_role`
- ✅ RLS activé sur toutes les tables
- ✅ Politiques limitées à `privacy = 'public'`
- ✅ Lecture seule (SELECT uniquement)
- ✅ Pas d'écriture (INSERT/UPDATE/DELETE bloqués)

---

### 8️⃣ Troubleshooting

#### ❌ "Wishlist not found"
- Vérifier que `privacy = 'public'` dans la DB
- Vérifier RLS policies
- Vérifier l'ID dans l'URL

#### ❌ "CORS Error"
- GitHub Pages autorise CORS par défaut
- Vérifier que Supabase URL est correct
- Vérifier la clé anon

#### ❌ "Deep link ne fonctionne pas"
- Vérifier `app.json` scheme
- Rebuild l'app après modification
- Tester avec `adb` (Android) ou Safari (iOS)

---

### 9️⃣ Améliorations Futures

- [ ] Custom domain (optionnel)
- [ ] PWA (service worker, cache)
- [ ] Analytics (Google Analytics, Plausible)
- [ ] SEO meta tags dynamiques
- [ ] Open Graph images
- [ ] QR Code generation
- [ ] Multi-langues (i18n)

---

### 🎯 Résultat Final

```
User clique sur lien
        ↓
GitHub Pages charge
        ↓
Supabase REST API (public read-only)
        ↓
Affiche wishlist
        ↓
Bouton "Ouvrir dans app"
        ↓
Deep link → App s'ouvre
        ↓
Navigation vers wishlist dans app
```

---

**Status** : ✅ PRÊT POUR PRODUCTION  
**Temps de setup** : ~10 minutes  
**Coût** : 💯 GRATUIT

---

_Guide complet généré le ${new Date().toLocaleDateString('fr-FR')}_
