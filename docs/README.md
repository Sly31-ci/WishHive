# 🎁 WishHive - Wishlists Publiques via GitHub Pages

## 📋 Configuration Complète

### 1️⃣ ✅ GitHub Pages Activé (DÉJÀ FAIT)

**GitHub Pages est déjà activé et opérationnel !**

Configuration actuelle :
- Repository : `https://github.com/Sly31-ci/WishHive`
- Branch : `main`
- Folder : `/docs`

**URL publique** : `https://Sly31-ci.github.io/WishHive`

**✅ Testé et fonctionnel !**

---

### 2️⃣ Configuration Supabase

#### A. Obtenir vos clés

1. Aller sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionner votre projet WishHive
3. Settings → API
4. Copier :
   - `Project URL` (SUPABASE_URL)
   - `anon public` key (SUPABASE_ANON_KEY)

#### B. ✅ Configuration Supabase (DÉJÀ FAIT)

**Les clés Supabase sont déjà configurées automatiquement !**

Fichier `docs/w/index.html` (lignes 427-428) :
```javascript
const SUPABASE_URL = 'https://nydtsqjlbiwuoakqrldr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Clé complète OK
```

**✅ Rien à faire, c'est déjà configuré !**

#### C. ✅ RLS Configuré (DÉJÀ FAIT)

**Les policies RLS ont été activées automatiquement via le script `configure-rls.sh` !**

Vérifiez que tout est OK :
```bash
cd /home/syzon/Téléchargements/WishHive
./configure-rls.sh
```

**Résultat attendu** : "✅ CONFIGURATION RLS TERMINÉE"

---

### 3️⃣ Intégration App Mobile

#### A. ✅ Génération de lien (DÉJÀ FAIT)

**Le code a été intégré dans l'app !**

Fichier `config/github-pages.ts` :
```typescript
export const GITHUB_PAGES_CONFIG = {
  username: 'Sly31-ci',
  repo: 'WishHive',
  get baseUrl() {
    return `https://${this.username}.github.io/${this.repo}`;
  }
};

export function generatePublicWishlistUrl(wishlistId: string): string {
  return `${GITHUB_PAGES_CONFIG.baseUrl}/w/?id=${wishlistId}`;
}
```

Fichier `lib/shareWishlist.ts` utilise déjà ces fonctions :
```typescript
import { generatePublicWishlistUrl } from '@/config/github-pages';

const shareLink = generatePublicWishlistUrl(wishlistId);
// Génère : https://Sly31-ci.github.io/WishHive/w/?id=abc123
```

**✅ Rien à faire, c'est déjà intégré !**

#### B. ✅ Configuration Deep Linking (DÉJÀ FAIT)

**Le fichier `app.json` a déjà été configuré !**

Actuellement dans `app.json` :
```json
{
  "expo": {
    "scheme": "wishhive",
    "android": {
      "intentFilters": [{
        "action": "VIEW",
        "data": [{
          "scheme": "https",
          "host": "Sly31-ci.github.io",
          "pathPrefix": "/WishHive/w"
        }],
        "category": ["BROWSABLE", "DEFAULT"]
      }]
    },
    "ios": {
      "bundleIdentifier": "com.wishhive.app",
      "associatedDomains": ["applinks:Sly31-ci.github.io"]
    }
  }
}
```

**✅ Rien à faire, c'est déjà configuré !**

**⚠️ IMPORTANT** : Rebuild requis pour activer deep linking :
```bash
npx expo prebuild --clean
npx expo start
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
