# 🔧 Supabase Network Issue - Workaround

## Problem
Docker port forwarding is failing - connections from host to containers on ports 8000 and 3000 are being reset.

## Root Cause
This appears to be a Docker networking issue, possibly related to:
- Docker 29.x compatibility issues
- iptables/firewall conflicts
- docker-proxy malfunction

## Temporary Solutions

### Option 1: Restart Docker Daemon (Recommended First)
```bash
sudo systemctl restart docker
cd ~/projects/supabase-local/supabase/docker
docker compose up -d
```

Then test:
```bash
curl http://localhost:8000/auth/v1/health \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzY4OTE1NzMxLCJleHAiOjIwODQyNzU3MzF9.hngs38z7DMyaERLwxNEl0x-u8ThSJgZMKt_4dPl0ug8"
```

### Option 2: Use Network IP Instead of Localhost
If localhost doesn't work, try using your network IP:

1. Edit `.env`:
```bash
# Change from:
EXPO_PUBLIC_SUPABASE_URL=http://localhost:8000

# To:
EXPO_PUBLIC_SUPABASE_URL=http://192.168.1.11:8000
```

2. Restart Expo:
```bash
# Kill the current dev server
# Then restart:
./start-dev.sh
```

### Option 3: Check for Port Conflicts
```bash
# See what's using port 8000
sudo lsof -i :8000

# Check iptables rules
sudo iptables -L -n -v | grep 8000
```

### Option 4: Rebuild Docker Network
```bash
cd ~/projects/supabase-local/supabase/docker
docker compose down
docker network prune -f
docker compose up -d
```

### Option 5: Check Docker Bridge Network
```bash
# Inspect the bridge
docker network inspect bridge

# Check if IP forwarding is enabled
sysctl net.ipv4.ip_forward

# Enable if needed
sudo sysctl -w net.ipv4.ip_forward=1
```

## Verification
Once fixed, all these should work:
```bash
# Test Kong
curl http://localhost:8000/

# Test Studio
curl http://localhost:3000/

# Test Auth with API key
curl -H "apikey: YOUR_ANON_KEY" http://localhost:8000/auth/v1/health
```

## If Nothing Works
Consider using Supabase Cloud temporarily or filing a bug report with:
- Docker version: 29.2.1
- OS: Linux
- Issue: docker-proxy connection resets on all exposed ports
