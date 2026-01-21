#!/bin/bash
# Script to import schema to local Supabase
# Usage: ./scripts/import-schema.sh

echo "🚀 Starting Schema Import via Docker (Bypassing Pooler)..."

# Function to run SQL via Docker
run_sql() {
    local file=$1
    if [ -f "$file" ]; then
        echo "📦 Importing $file..."
        # Pipe the file content to the docker container's psql
        cat "$file" | docker exec -i supabase-db psql -U postgres -d postgres
        
        if [ $? -eq 0 ]; then
            echo "   ✅ $file imported successfully"
        else
            echo "   ❌ Error importing $file"
            exit 1
        fi
    else
        echo "⚠️  Warning: $file not found, skipping."
    fi
}

# 1. Core Schema (Tables)
run_sql "schema_core.sql"

# 2. Functions & Triggers
run_sql "schema_functions.sql"

# 3. Additional Modules
MODULES=(
    "schema_storage.sql"
    "schema_notifications.sql"
    "schema_chat.sql"
    "schema_theme.sql"
    "schema_enhancements.sql"
)

for file in "${MODULES[@]}"; do
    run_sql "$file"
done

echo "✅ Schema Import Complete!"
