# Production Docker Setup - Quick Start

## Quick Start

```bash
# 1. Configure environment
cp .env.production .env
# Edit .env with your production values

# 2. Start services
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Check status
docker-compose -f docker-compose.prod.yml ps

# 4. View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/auth/login

**Default Admin Credentials:**
- Email: `admin@trustauto.co.ke`
- Password: `Admin123!`

⚠️ **Change these credentials in production!**

## Environment Variables Required

Before starting, configure in `.env`:

```bash
# Database
POSTGRES_PASSWORD=strong_password_here

# Authentication
JWT_SECRET=minimum_32_character_secret_here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Management Commands

```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Restart services
docker-compose -f docker-compose.prod.yml restart

# View status
docker-compose -f docker-compose.prod.yml ps

# Rebuild from scratch
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d --build

# View logs (all services)
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f postgres
```

## Services

- **PostgreSQL** - Database (port 5432)
- **Backend** - Node.js API (port 5000)
- **Frontend** - Next.js app (port 3000)

## Files

- `docker-compose.prod.yml` - Production Docker Compose configuration
- `backend/Dockerfile` - Backend multi-stage build
- `frontend/Dockerfile` - Frontend multi-stage build
- `.env` - Environment variables (create from .env.production)

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Rebuild
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate
```

### Database connection issues
```bash
# Check database health
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres
```

### Port conflicts
```bash
# Edit .env to change ports
BACKEND_PORT=8000
FRONTEND_PORT=8080
```

## For full documentation, see DEPLOYMENT.md
