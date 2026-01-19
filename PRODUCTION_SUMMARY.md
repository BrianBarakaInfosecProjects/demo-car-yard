# Production Setup Summary

Production deployment has been simplified to use only **Docker Compose** with environment variables.

## Quick Start

```bash
# 1. Configure environment
cp .env.production .env
# Edit .env with your production values

# 2. Start all services
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Run database migrations
docker exec trustauto-backend npx prisma migrate deploy

# 4. Access application
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
# Admin:    http://localhost:3000/auth/login
```

## Files Created for Production

| File | Purpose |
|------|---------|
| `docker-compose.prod.yml` | Production Docker Compose configuration |
| `backend/Dockerfile` | Backend multi-stage build (Node 20 + OpenSSL) |
| `frontend/Dockerfile` | Frontend multi-stage build (Node 20) |
| `.env.production` | Production environment template |
| `.dockerignore` files (root, backend, frontend) | Optimize build context |
| `DOCKER_SETUP.md` | Quick reference |
| `DEPLOYMENT.md` | Detailed deployment guide |
| `PRODUCTION_SUMMARY.md` | Setup summary |
| `PRODUCTION_COMPLETE.md` | Complete setup guide with troubleshooting |

## Key Environment Variables

Required in `.env` before starting:

```bash
POSTGRES_PASSWORD=strong_password
JWT_SECRET=minimum_32_character_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Common Commands

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d --build

# Stop services
docker-compose -f docker-compose.prod.yml down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose -f docker-compose.prod.yml down -v

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps

# Restart
docker-compose -f docker-compose.prod.yml restart

# Run database migrations
docker exec trustauto-backend npx prisma migrate deploy
```

## Services

1. **PostgreSQL** - Database (port 5432)
2. **Backend** - Node.js/Express API (port 5000)
3. **Frontend** - Next.js application (port 3000)

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

### Database Initialization
- Migrations must be run manually: `docker exec trustauto-backend npx prisma migrate deploy`

## Next Steps

1. Copy `.env.production` to `.env`
2. Edit `.env` with your production values
3. Run `docker-compose -f docker-compose.prod.yml up -d --build`
4. Run migrations: `docker exec trustauto-backend npx prisma migrate deploy`
5. Access application
6. Change default admin password
7. Configure HTTPS for production use

## Troubleshooting

### Backend won't start
```bash
# Check logs
docker logs trustauto-backend -f

# Run migrations
docker exec trustauto-backend npx prisma migrate deploy

# Check database connection
docker exec trustauto-db pg_isready -U postgres
```

### Authentication errors
```bash
# Ensure database is fresh
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

For full documentation, see `DEPLOYMENT.md` or `PRODUCTION_COMPLETE.md`.

