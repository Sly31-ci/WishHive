#!/usr/bin/env bash
set -e

# Script to generate app icons and splash from assets/logo-source.png
# Usage: ./generate-icons.sh
SRC="assets/logo-source.png"
ICON="assets/icon.png"
SPLASH="assets/splash.png"
ADAPTIVE="assets/adaptive-icon.png"

if [ ! -f "$SRC" ]; then
  echo "Erreur: $SRC introuvable. Placez votre logo source dans assets/logo-source.png"
  exit 1
fi

# Prefer magick (ImageMagick 7+), fallback to convert (ImageMagick 6)
if command -v magick >/dev/null 2>&1; then
  IM_CMD="magick"
elif command -v convert >/dev/null 2>&1; then
  IM_CMD="convert"
else
  echo "Erreur: ImageMagick n'est pas installé. Installez-le (brew install imagemagick) ou utilisez un éditeur graphique."
  exit 1
fi

mkdir -p assets

echo "Génération de $ICON (1024x1024)..."
$IM_CMD "$SRC" -resize 1024x1024^ -gravity center -extent 1024x1024 "$ICON"

echo "Génération de $SPLASH (2732x2732)..."
$IM_CMD "$SRC" -resize 2732x2732^ -gravity center -extent 2732x2732 "$SPLASH"

echo "Génération de $ADAPTIVE (1024x1024)..."
$IM_CMD "$SRC" -resize 1024x1024^ -gravity center -extent 1024x1024 "$ADAPTIVE"

# Optional: make adaptive icon foreground transparent background if source had a full background
# (This is naive: if your logo already has a solid background you may need manual transparency edits)
# echo "Essai de rendre le fond transparent (peut ne pas convenir) ..."
# $IM_CMD "$ADAPTIVE" -fuzz 10% -transparent white "$ADAPTIVE"

# Optimize images if expo is available
if command -v expo >/dev/null 2>&1 || command -v npx >/dev/null 2>&1; then
  if command -v expo >/dev/null 2>&1; then
    echo "Optimisation des images avec expo optimize..."
    expo optimize "$ICON" "$SPLASH" "$ADAPTIVE" || true
  else
    echo "Optimisation des images avec npx expo-cli optimize..."
    npx expo-cli@latest optimize "$ICON" "$SPLASH" "$ADAPTIVE" || true
  fi
else
  echo "expo-cli non trouvé: passez l'optimisation d'images (recommandée)."
fi

echo "Ajout au git et commit..."
git add "$ICON" "$SPLASH" "$ADAPTIVE" "$SRC" || true
git commit -m "feat: add app icon and splash images (generated from logo-source.png)" || echo "Aucun changement à commit ou git non initialisé."

echo "Terminé. N'oubliez pas : git push origin main pour pousser les changements."
