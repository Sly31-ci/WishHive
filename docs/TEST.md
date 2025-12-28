# 🧪 Test Rapide - GitHub Pages Wishlists

## Test en Local (OPTIONNEL)

Avant de déployer, vous pouvez tester localement :

### Méthode 1 : Python (recommandé)
```bash
cd docs
python3 -m http.server 8000

# Ouvrir : http://localhost:8000
# Wishlist test : http://localhost:8000/w/?id=test-id
```

### Méthode 2 : Node.js
```bash
npx serve docs

# Ouvrir URL affichée
```

### Méthode 3 : PHP
```bash
cd docs
php -S localhost:8000

# Ouvrir : http://localhost:8000
```

---

## Test Après Déploiement

### 1. Créer une wishlist de test

Dans l'app WishHive :
```
1. Créer nouvelle wishlist
2. Titre : "Test Public"
3. Privacy : "Public" ⚠️ IMPORTANT
4. Ajouter 2-3 items
5. Copier l'ID de la wishlist
```

### 2. Ouvrir dans navigateur

```
https://Sly31-ci.github.io/WishHive/w/?id=VOTRE_WISHLIST_ID
```

### 3. Vérifications

- [ ] Page charge sans erreur
- [ ] Titre s'affiche
- [ ] Emoji s'affiche
- [ ] Description visible (si ajoutée)
- [ ] Items listés correctement
- [ ] Images des items chargent
- [ ] Prix affichés
- [ ] Badges priorité visibles
- [ ] Bouton "Ouvrir dans app" présent
- [ ] Design responsive sur mobile

---

## Test Deep Link (Mobile)

### Android
```bash
# Via adb
adb shell am start -a android.intent.action.VIEW \
  -d "wishhive://wishlists/VOTRE_WISHLIST_ID"
```

### iOS
```
# Dans Safari
wishhive://wishlists/VOTRE_WISHLIST_ID

# Ou tester Universal Link
https://Sly31-ci.github.io/WishHive/w/?id=VOTRE_WISHLIST_ID
```

---

## Checklist Déploiement

- [ ] GitHub Pages activé
- [ ] SUPABASE_URL configuré dans `docs/w/index.html`
- [ ] SUPABASE_ANON_KEY configuré
- [ ] SQL RLS exécuté dans Supabase
- [ ] Files commités et pushés
- [ ] Page home accessible
- [ ] Page wishlist teste fonctionne
- [ ] Mobile responsive OK
- [ ] Deep link configuré (optionnel)

---

## Commandes Git

```bash
# Vérifier les fichiers
git status

# Ajouter docs/
git add docs/ config/

# Commit
git commit -m "Add GitHub Pages for public wishlists sharing

- Add docs/ folder with wishlist viewer
- Add Supabase RLS configuration
- Add public sharing functionality
- Mobile-first responsive design"

# Push
git push origin main

# Attendre 1-2 minutes pour déploiement
```

---

## URLs à garder

**Page d'accueil** :  
`https://Sly31-ci.github.io/WishHive/`

**Wishlist (template)** :  
`https://Sly31-ci.github.io/WishHive/w/?id=VOTRE_ID`

**Deep link (template)** :  
`wishhive://wishlists/VOTRE_ID`

---

✅ **C'est prêt !** Vous pouvez maintenant déployer ! 🚀
