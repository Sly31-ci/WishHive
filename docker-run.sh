#!/bin/bash
# Script pour lancer l'application WishHive via Docker
echo "🚀 Lancement de WishHive via Docker..."

# S'assurer que le réseau Supabase existe
docker network inspect supabase_default >/dev/null 2>&1 || \
    docker network create supabase_default

# Lancer le container
docker compose up
