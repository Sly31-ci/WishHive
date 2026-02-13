#!/bin/bash

# Script de contournement pour le problème de ports Docker
# Ce script expose directement les services Supabase sans passer par Kong

echo "🔧 Application du correctif pour les ports Docker..."
echo ""

DOCKER_DIR="$HOME/projects/supabase-local/supabase/docker"

if [ ! -d "$DOCKER_DIR" ]; then
    echo "❌ Répertoire Supabase non trouvé: $DOCKER_DIR"
    exit 1
fi

cd "$DOCKER_DIR"

# Arrêter les conteneurs
echo "📦 Arrêt des conteneurs Supabase..."
docker compose down

# Créer un fichier docker-compose.override.yml pour exposer les ports directement
echo "📝 Création du fichier de configuration override..."

cat > docker-compose.override.yml << 'EOF'
# Override temporaire pour contourner le problème de ports Kong
# Ce fichier expose directement les services sans passer par Kong

services:
  auth:
    ports:
      - "9999:9999"  # Expose GoTrue directement
  
  rest:
    ports:
      - "3001:3000"  # Expose PostgREST directement
  
  storage:
    ports:
      - "5000:5000"  # Expose Storage directement
  
  realtime:
    ports:
      - "4000:4000"  # Expose Realtime directement
EOF

echo "✅ Fichier override créé"
echo ""

# Redémarrer avec le nouveau fichier
echo "🚀 Redémarrage des conteneurs avec les nouveaux ports..."
docker compose up -d

echo ""
echo "⏳ Attente du démarrage des services (30 secondes)..."
sleep 30

echo ""
echo "✅ Configuration terminée!"
echo ""
echo "📊 Nouveaux ports disponibles:"
echo "   - Auth (GoTrue):    http://localhost:9999"
echo "   - REST (PostgREST): http://localhost:3001"
echo "   - Storage:          http://localhost:5000"
echo "   - Realtime:         http://localhost:4000"
echo "   - Studio:           http://localhost:3000 (inchangé)"
echo ""
echo "🔄 Prochaine étape:"
echo "   Modifiez votre .env pour utiliser:"
echo "   EXPO_PUBLIC_SUPABASE_URL=http://localhost:9999"
echo ""
