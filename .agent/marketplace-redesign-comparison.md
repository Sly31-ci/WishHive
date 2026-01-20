# Comparaison Marketplace - Design Figma vs Implémentation Actuelle

## 📋 Vue d'ensemble

Ce document compare le design Figma souhaité avec l'implémentation actuelle du Marketplace pour identifier les modifications à apporter.

---

## 🎨 Design Figma - Éléments clés

D'après le design Figma, voici les caractéristiques principales :

### Header
- **Titre** : "Marketplace"
- **Sous-titre** : "Make Wishes Real"
- Icône de recherche à droite

### Barre de recherche
- Barre de recherche proéminente avec placeholder
- Bouton de filtre à droite de la barre de recherche
- Visible en permanence (non cachée)

### Filtres/Catégories
- Chips de filtres : "All", "Popular", "Newest", "Trending"
- Design de chips avec style arrondi
- Affichage horizontal avec scroll

### Grille de produits
- Grille à 2 colonnes
- Cards avec :
  - Images de produits
  - Nom du produit
  - Rating avec étoiles (⭐⭐⭐⭐⭐)
  - Icône cœur pour favoris (en haut à droite de l'image)

### Navigation
- Barre de navigation en bas
- Bouton d'action flottant central (+)
- 4 icônes de navigation

---

## 📱 Implémentation Actuelle

### Header
✅ **Titre** : "Marketplace" (conforme)
❌ **Sous-titre** : Absent - "Make Wishes Real" n'est pas affiché
✅ **Icône de recherche** : Présente

### Barre de recherche
❌ **Visible par défaut** : Cachée - s'affiche seulement quand l'icône est cliquée
❌ **Bouton de filtre** : Absent
❌ **Design** : Différent du design Figma

### Filtres/Catégories
⚠️ **Filtres** : 3 filtres seulement (Popular, Newest, Trending)
❌ **"All"** : Le filtre "All" est absent
⚠️ **Design** : Les chips utilisent des emojis (🔥, ✨, 📈)

### Grille de produits
✅ **Grille 2 colonnes** : Conforme
✅ **Images de produits** : Présentes
✅ **Nom du produit** : Affiché
❌ **Rating avec étoiles** : Absent - aucun système de notation visible
❌ **Position du cœur** : Badge en bas à droite avec compteur, pas en haut à droite
⚠️ **Heart badge** : Affiche le nombre de fois ajouté aux wishlists

### Extras actuels
✅ **TrendingSection** : Section trending en en-tête de la liste
✅ **Pull-to-refresh** : Fonctionnel
✅ **Animations** : FadeInDown sur les cartes

---

## 🔧 Modifications nécessaires

### 1. Header
- [ ] Ajouter le sous-titre "Make Wishes Real" sous le titre principal
- [ ] Ajuster le style du header pour correspondre au design Figma

### 2. Barre de recherche
- [ ] Rendre la barre de recherche visible par défaut
- [ ] Ajouter un bouton de filtre à droite de la barre de recherche
- [ ] Revoir le design pour correspondre au Figma (style, couleurs, bordures)

### 3. Filtres
- [ ] Ajouter le filtre "All" qui affiche tous les produits
- [ ] Retirer les emojis des chips si le design Figma n'en a pas
- [ ] Ajuster le style des FilterChips pour correspondre au design

### 4. Cards produits
- [ ] Ajouter un système de rating avec étoiles (si les données existent en DB)
- [ ] Déplacer l'icône cœur en haut à droite de l'image
- [ ] Revoir le design du badge cœur
- [ ] S'assurer que le style général des cards correspond au Figma

### 5. Navigation
- [ ] Vérifier que la navigation bottom correspond au design
- [ ] Vérifier le bouton d'action flottant central

---

## 📊 Priorités

### Haute priorité (Impact visuel majeur)
1. Ajouter le sous-titre "Make Wishes Real"
2. Rendre la barre de recherche visible par défaut
3. Ajouter le système de rating avec étoiles
4. Repositionner l'icône cœur

### Priorité moyenne (Améliorations UX)
5. Ajouter le filter "All"
6. Ajouter le bouton de filtre dans la searchbar
7. Ajuster les styles des FilterChips

### Priorité basse (Polish)
8. Ajuster les espacements et marges pour correspondre exactement au Figma
9. Vérifier les couleurs et typographies

---

## 🎯 Prochaines étapes

Avant de commencer les modifications, confirmez :
1. ✅ Vous avez vu le design Figma
2. ✅ Vous avez vu le code actuel
3. ❓ Souhaitez-vous procéder avec ces modifications ?
4. ❓ Y a-t-il des priorités spécifiques ou des éléments à modifier en premier ?
5. ❓ Avez-vous des données de rating pour les produits dans la base de données ?

---

## 💡 Notes techniques

- Le fichier à modifier : `/home/syzon/Téléchargements/WishHive/app/(tabs)/marketplace.tsx`
- Composants existants à utiliser :
  - `FilterChip` (peut nécessiter des ajustements)
  - `Card`
  - `TrendingSection`
- Thème et design system : Utilise `COLORS`, `SPACING`, `FONT_SIZES`, `BORDER_RADIUS`, `SHADOWS` de `@/constants/theme`
