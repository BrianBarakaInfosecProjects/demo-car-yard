# TrustAuto Kenya - Docker Compose Files

This directory contains Docker Compose configurations for different environments.

## Files

### `docker-compose.yml`
- **Environment**: Development (PostgreSQL only)
- **Usage**: Development when running backend/frontend locally
- **Start**: `docker-compose up -d`
- **Note**: Only runs PostgreSQL database; Node services run via npm scripts

### `docker-compose.dev.yml`
- **Environment**: Development override
- **Usage**: Override to run everything in Docker containers
- **Start**: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build`
- **Note**: Runs all services in Docker for containerized development

### `docker-compose.prod.yml`
- **Environment**: Production
- **Usage**: Production deployment
- **Start**: `docker-compose -f docker-compose.prod.yml up -d --build`
- **Features**:
  - Multi-stage builds for optimized images
  - Production-optimized Node.js (Alpine)
  - Health checks on all services
  - Proper networking and restart policies
  - Standalone Next.js build

## Quick Start

### Development (Recommended)
```bash
# Start only database in Docker
docker-compose up -d

# Start backend locally
cd backend && npm run dev

# Start frontend locally
cd frontend && npm run dev
```

Or use the convenience script:
```bash
./restart-all.sh
```

### Development (Dockerized)
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

### Production
```bash
# Configure environment
cp .env.production .env
# Edit .env with your values

# Start production services
docker-compose -f docker-compose.prod.yml up -d --build
```

## Service Architecture

```
┌─────────────────────────────────────────────────┐
│              Docker Network                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐      ┌──────────────┐        │
│  │  Frontend    │──────│  Backend     │        │
│  │  (Next.js)   │      │  (Express)   │        │
│  │  Port: 3000  │      │  Port: 5000  │        │
│  └──────────────┘      └──────┬───────┘        │
│                               │                 │
│                               ▼                 │
│                        ┌──────────────┐        │
│                        │ PostgreSQL   │        │
│                        │ Port: 5432  │        │
│                        └──────────────┘        │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Environment Variables

### Development (.env)
- Uses default values for local development
- Database: `localhost:5432`
- Backend: `localhost:5000`
- Frontend: `localhost:3000`

### Production (.env.production)
- Requires configuration before deployment
- Strong passwords and secrets
- Production URLs and CORS origins
- Cloudinary credentials

## Network

All services communicate via `trustauto-network` bridge network in production.

In development, backend/frontend can access database via `localhost:5432`.

## Volumes

### `postgres_data`
- Persistent PostgreSQL data
- Survives container restarts
- Location: Docker managed volume

## Health Checks

### Production
- PostgreSQL: `pg_isready` (every 10s)
- Backend: `/health` endpoint (manual curl check)
- Frontend: HTTP 200/302 response (manual curl check)

## Troubleshooting

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### Reset Everything
```bash
docker-compose -f docker-compose.prod.yml down -v
```

### Rebuild Images
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## Differences Between Environments

| Feature | Development | Production |
|---------|-------------|------------|
| Database | Docker | Docker |
| Backend | Local Node | Docker |
| Frontend | Local Node | Docker |
| Build | Development | Standalone optimized |
| Logging | Console | Docker logs |
| Restart Policy | None | Unless stopped |
| Health Checks | Optional | Required |
| Networking | Host | Bridge network |
