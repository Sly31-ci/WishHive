#!/bin/bash

# WishHive Development Starter Script
# Usage: ./start-dev.sh

echo "🚀 Starting WishHive Development Environment..."
echo "============================================="

# 1. Start Supabase Local (Docker)
echo "🐳 Checking Supabase Docker containers..."

# Path to your local supabase docker setup - ADAPT IF NEEDED
SUPABASE_DOCKER_PATH="$HOME/projects/supabase-local/supabase/docker"

if [ -d "$SUPABASE_DOCKER_PATH" ]; then
    cd "$SUPABASE_DOCKER_PATH"
    
    # Check if containers are already running
    if docker compose ps | grep -q "Up"; then
        echo "   ✅ Supabase is already running."
    else
        echo "   🔄 Starting Supabase containers..."
        docker compose up -d
        if [ $? -eq 0 ]; then
            echo "   ✅ Supabase started successfully!"
        else
            echo "   ❌ Failed to start Supabase. Please check Docker Desktop."
            exit 1
        fi
    fi
else
    echo "   ⚠️  Could not find Supabase Docker path at $SUPABASE_DOCKER_PATH"
    echo "   ⚠️  Skipping Docker start. Ensure database is running."
fi

# Return to project root
cd - > /dev/null

echo ""
echo "📊 Dashboard Access:"
echo "   - Supabase Studio: http://localhost:3000"
echo "   - API URL:         http://localhost:8000"
echo "============================================="
echo ""

# Quick connectivity check (helps diagnose "Network request failed" early)
echo "🔎 Checking Supabase API connectivity..."
API_CODE=$(timeout 2 curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/ 2>/dev/null || echo "TIMEOUT")
if [ "$API_CODE" = "TIMEOUT" ] || [ "$API_CODE" = "000" ]; then
    echo "   ❌ Supabase API is NOT reachable on http://localhost:8000 (code: $API_CODE)"
    echo "   👉 Run: ./diagnose-supabase.sh"
    echo "   👉 If you use a real iPhone, set EXPO_PUBLIC_SUPABASE_URL to your PC IP in .env"
else
    echo "   ✅ Supabase API reachable (code: $API_CODE)"
fi
echo ""

# 2. Start Expo Development Server
echo "📱 Starting Expo Development Server..."
echo "   (Press 'w' for web, 'a' for Android, 'i' for iOS)"
echo ""

# Run npm run dev
npm run dev
