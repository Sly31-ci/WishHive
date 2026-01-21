#!/bin/bash

# 💾 Script de Restauration - WishHive V1.5 Stable
# 
# Ce script restaure l'application à son état stable avant la refonte V2.0
# Usage: ./restore-backup.sh

set -e  # Exit on error

BACKUP_TAG="v1.5-stable-before-refonte"
BACKUP_BRANCH="backup-before-v2-refonte"

echo "🔄 Restauration de WishHive V1.5 Stable..."
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le dossier WishHive"
    exit 1
fi

# Afficher le statut actuel
echo "📊 État actuel:"
git log --oneline -1
echo ""

# Demander confirmation
read -p "⚠️  Voulez-vous vraiment restaurer la version V1.5 stable ? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restauration annulée"
    exit 0
fi

# Sauvegarder l'état actuel (au cas où)
echo "💾 Sauvegarde de l'état actuel..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_CURRENT_BRANCH="backup-current-${TIMESTAMP}"

git branch "${BACKUP_CURRENT_BRANCH}"
echo "✅ État actuel sauvegardé dans: ${BACKUP_CURRENT_BRANCH}"
echo ""

# Vérifier si des fichiers sont modifiés
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Vous avez des modifications non commitées."
    read -p "Voulez-vous les stasher ? (y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git stash save "Auto-stash avant restauration V1.5 - ${TIMESTAMP}"
        echo "✅ Modifications stashées"
    else
        echo "❌ Restauration annulée (modifications non commitées)"
        git branch -D "${BACKUP_CURRENT_BRANCH}"
        exit 1
    fi
fi

# Restaurer depuis le tag
echo "🔄 Restauration vers ${BACKUP_TAG}..."
git checkout "${BACKUP_TAG}"
echo "✅ Code restauré !"
echo ""

# Créer une nouvelle branche pour travailler depuis cette version
NEW_BRANCH="restored-v1.5-${TIMESTAMP}"
git checkout -b "${NEW_BRANCH}"
echo "✅ Nouvelle branche créée: ${NEW_BRANCH}"
echo ""

# Réinstaller les dépendances
echo "📦 Réinstallation des dépendances..."
npm install
echo "✅ Dépendances installées"
echo ""

# Vérifier la base de données
echo "🗄️  Vérification Supabase Local..."
if docker ps | grep -q supabase-db; then
    echo "✅ Supabase Local est en cours d'exécution"
else
    echo "⚠️  Supabase Local n'est pas démarré"
    echo "   Lancez: cd ~/projects/supabase-local/supabase/docker && docker compose up -d"
fi
echo ""

# Résumé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ RESTAURATION TERMINÉE !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Version restaurée:"
git log --oneline -1
echo ""
echo "🌿 Branche actuelle: ${NEW_BRANCH}"
echo ""
echo "💡 Prochaines étapes:"
echo "   1. Vérifiez que Supabase Local tourne"
echo "   2. Lancez l'app: npm run dev"
echo "   3. Testez les fonctionnalités"
echo ""
echo "🔙 Pour revenir à l'état précédent:"
echo "   git checkout ${CURRENT_BRANCH}"
echo ""
echo "💾 Backup de l'état précédent:"
echo "   Branche: ${BACKUP_CURRENT_BRANCH}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
