# Production Setup Summary

Production deployment has been simplified to use only **Docker Compose** with environment variables.

## Deployment Options

### Option 1: Docker Compose (Standard)
Direct port exposure on host machine.

### Option 2: Traefik/Dökploy (Recommended for Production)
Reverse proxy with automatic HTTPS and domain routing.

## Quick Start - Standard

```bash
# 1. Configure environment
cp .env.production .env
# Edit .env with your production values

# 2. Start all services
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Run database migrations
docker exec trustauto-backend npx prisma migrate deploy
```

## Quick Start - Traefik/Dökploy

```bash
# 1. Configure environment
cp .env.production .env
# Set FRONTEND_HOST=your-domain.com

# 2. Deploy via dökploy
# (dökploy will clone, build, and start with Traefik)
```

See **TRAEFIK_DEPLOYMENT.md** for detailed Traefik setup.

## Files Created for Production

| File | Purpose |
|------|---------|
| `docker-compose.prod.yml` | Production Docker Compose (with Traefik labels) |
| `backend/Dockerfile` | Backend multi-stage build (Node 20 + OpenSSL) |
| `frontend/Dockerfile` | Frontend multi-stage build (Node 20) |
| `.env.production` | Production environment template |
| `.dockerignore` files (root, backend, frontend) | Optimize build context |
| `DOCKER_SETUP.md` | Quick reference |
| `DEPLOYMENT.md` | Detailed deployment guide |
| `TRAEFIK_DEPLOYMENT.md` | Traefik/Dökploy specific guide |
| `PRODUCTION_SUMMARY.md` | Setup summary |

## Key Environment Variables

### Standard Deployment
```bash
POSTGRES_PASSWORD=strong_password
JWT_SECRET=minimum_32_character_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Traefik Deployment (Required)
```bash
FRONTEND_HOST=your-domain.com
TRAEFIK_CERT_RESOLVER=letsencrypt
POSTGRES_PASSWORD=strong_password
JWT_SECRET=minimum_32_character_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Common Commands

### Standard Deployment
```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d --build

# Stop services
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps

# Restart
docker-compose -f docker-compose.prod.yml restart
```

### Traefik Deployment
```bash
# No manual docker commands needed
# dökploy handles everything via the deployment panel
# View logs in dökploy dashboard
```

## Services

1. **PostgreSQL** - Database (port 5432, internal only)
2. **Backend** - Node.js/Express API (port 5000, internal only with Traefik)
3. **Frontend** - Next.js application (port 3000, internal only with Traefik)

## Communication Flow

### Standard Deployment
```
Frontend (localhost:3000) → Backend (localhost:5000)
                        ↓
                   PostgreSQL (localhost:5432)
```

### Traefik Deployment
```
Internet (HTTPS)
      ↓
[ Traefik ] → Frontend (internal:3000) → Backend (internal:5000) → PostgreSQL (internal:5432)
```

## Default Admin Credentials

- Email: `admin@trustauto.co.ke`
- Password: `Admin123!`

⚠️ **Change these after first login!**

## Important Changes Made

### TypeScript Compilation
- Fixed type annotations in `audit.ts` and `analyticsService.ts`

### Docker Configuration
- Updated to Node.js 20 (Next.js requirement)
- Added OpenSSL to backend (Prisma requirement)
- Added PostgreSQL to `trustauto-network` (connectivity)
- Changed from `npm ci` to `npm install` (network reliability)
- Added Traefik labels for reverse proxy
- Removed external port exposures (Traefik handles routing)

### Database Initialization
- Migrations must be run manually: `docker exec trustauto-backend npx prisma migrate deploy`

### API Configuration
- Frontend uses `http://backend:5000/api` (internal service name)
- No hardcoded `0.0.0.0` in production code

## Next Steps

### Standard Deployment
1. Copy `.env.production` to `.env`
2. Edit `.env` with your production values
3. Run `docker-compose -f docker-compose.prod.yml up -d --build`
4. Run migrations: `docker exec trustauto-backend npx prisma migrate deploy`
5. Access application
6. Change default admin password
7. Configure HTTPS with reverse proxy (nginx/traefik)

### Traefik Deployment
1. Copy `.env.production` to `.env`
2. Edit `.env` with:
   - `FRONTEND_HOST=your-domain.com`
   - Strong passwords and secrets
3. Deploy via dökploy
4. Access at `https://your-domain.com`
5. Change default admin password

## Troubleshooting

### Standard Deployment

### Backend won't start
```bash
# Check logs
docker logs trustauto-backend -f

# Run migrations
docker exec trustauto-backend npx prisma migrate deploy

# Check database connection
docker exec trustauto-db pg_isready -U postgres
```

### Frontend can't connect to backend
```bash
# Check NEXT_PUBLIC_API_URL
docker exec trustauto-frontend printenv | grep NEXT_PUBLIC_API_URL

# Verify backend is accessible
docker exec trustauto-frontend wget -q -O- http://backend:5000/health

# Check both services on same network
docker network inspect trustauto-network
```

### Port conflicts
```bash
# Check what's using the port
lsof -i :3000 -P | head -10
lsof -i :5000 -P | head -10
```

### Authentication errors
```bash
# Ensure database is fresh
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

### Traefik Deployment

### Frontend not accessible
1. Verify `FRONTEND_HOST` is set correctly
2. Check Traefik dashboard for routing rules
3. Verify domain DNS points to deployment server
4. Check Traefik logs for certificate errors

### Backend not accessible from frontend
```bash
# Test internal communication
docker exec trustauto-frontend wget -q -O- http://backend:5000/health

# Should return: {"success":true,"status":"ok",...}
```

### HTTPS not working
1. Verify `TRAEFIK_CERT_RESOLVER=letsencrypt`
2. Check domain DNS resolution
3. Ensure ports 80/443 are open
4. Check Traefik logs for certificate errors

## For More Information

- **Standard deployment**: See `DEPLOYMENT.md` or `PRODUCTION_COMPLETE.md`
- **Traefik deployment**: See `TRAEFIK_DEPLOYMENT.md`
