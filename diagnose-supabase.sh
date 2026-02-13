#!/bin/bash

echo "🔍 WishHive Supabase Diagnostic Tool"
echo "====================================="
echo ""

# 1. Check Docker containers
echo "📦 Docker Containers Status:"
docker ps --filter name=supabase --format "table {{.Names}}\t{{.Status}}" | grep supabase
echo ""

# 2. Check network connectivity
echo "🌐 Network Connectivity:"
echo "  - Localhost (127.0.0.1): $(timeout 2 curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/ 2>/dev/null || echo "TIMEOUT")"
echo "  - IPv4 (192.168.1.11): $(timeout 2 curl -s -o /dev/null -w "%{http_code}" http://192.168.1.11:8000/ 2>/dev/null || echo "TIMEOUT")"
echo ""

# 3. Check Kong health from inside container
echo "🦍 Kong Internal Health:"
docker exec supabase-kong kong health 2>&1 | grep -i "healthy\|running"
echo ""

# 4. Check if auth service is reachable from Kong
echo "🔐 Auth Service (from Kong's perspective):"
docker exec supabase-kong ping -c 1 auth 2>&1 | grep "1 packets received" && echo "  ✅ Auth is reachable" || echo "  ❌ Auth is NOT reachable"
echo ""

# 5. Check if auth service is healthy
echo "🔐 Auth Service Health:"
docker exec supabase-auth wget -q -O- http://localhost:9999/health 2>&1 | grep -q "GoTrue" && echo "  ✅ Auth is healthy" || echo "  ❌ Auth is NOT healthy"
echo ""

# 6. Test Kong routing from inside Docker network
echo "🔀 Kong Routing Test (from auth container):"
docker exec supabase-auth wget -q -O- -T 2 http://kong:8000/auth/v1/health 2>&1 | head -1
echo ""

# 7. Check Kong configuration
echo "⚙️  Kong Configuration:"
docker exec supabase-kong ls -la /home/kong/*.yml 2>&1 | grep -E "kong.yml|temp.yml"
echo ""

# 8. Check for port conflicts
echo "🔌 Port 8000 Status:"
netstat -tuln | grep ":8000 " || echo "  Port 8000 not listening"
echo ""

# 9. Suggest solutions
echo "💡 Suggested Solutions:"
echo "  1. If Kong is hanging, try: cd ~/projects/supabase-local/supabase/docker && docker compose down && docker compose up -d"
echo "  2. If network IP doesn't work, use localhost in .env: EXPO_PUBLIC_SUPABASE_URL=http://localhost:8000"
echo "  3. For mobile testing, you may need to configure Kong to accept requests from your network IP"
echo "  4. Check firewall: sudo ufw status (if using UFW)"
echo ""
echo "====================================="
