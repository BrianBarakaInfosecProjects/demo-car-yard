# Production Deployment Guide

This guide explains how to deploy the TrustAuto Kenya application in production using Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- At least 2GB of RAM available
- 10GB of free disk space

## Quick Start

### Choose Your Deployment Method

You have two options for deploying with `docker-compose.prod.yml` using the `.env.dokploy` environment file:

#### Option 1: Using `--env-file` Flag (Recommended)

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy up -d --build
```

**Advantages:**
- Explicit - clearly shows which env file is being used
- No file renaming required
- Can easily switch between different env files (e.g., `.env.staging`, `.env.production`)

**Example Use Cases:**
```bash
# Development with staging config
docker-compose -f docker-compose.prod.yml --env-file .env.staging up -d

# Production deployment
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy up -d
```

**Common Commands:**
```bash
# Stop containers
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy down

# Rebuild after changes
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy up -d --build

# View logs
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy logs -f
```

#### Option 2: Copy to .env.prod

First, copy the environment file:

```bash
cp .env.dokploy .env.prod
```

Then deploy:

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

**Note:** You must still use `--env-file` because Docker Compose only auto-loads `.env` when the compose file is named `docker-compose.yml` (default), not `docker-compose.prod.yml`.

### 1. Configure Environment Variables

Edit `.env.dokploy` and update these critical values:

```bash
# Change these to strong, unique values
POSTGRES_PASSWORD=your_secure_database_password
JWT_SECRET=your_minimum_32_character_secret_key

# Update Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. Start Services

Use your chosen option from above to start the services.

### 3. Verify Deployment

Access the application:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000/api (proxied through nginx)
- **Admin Panel**: http://localhost:3000/auth/login

**Note:** Backend is no longer directly accessible. All API calls go through nginx on port 3000.

Default admin credentials:
- Email: `admin@trustauto.co.ke`
- Password: `Admin123!`

⚠️ **IMPORTANT**: Change the default admin password after first login!

## Services Overview

The production setup includes four services:

1. **PostgreSQL Database** (Port 5432 - internal)
   - Persistent data storage
   - Automated health checks
   - Volume-backed data persistence
   - Not exposed externally

2. **Backend API** (Port 5000 - internal)
   - Node.js/Express API
   - Prisma ORM with PostgreSQL
   - JWT authentication
   - Health endpoint at `/health`
   - **Not exposed externally** - accessed only through nginx

3. **Frontend** (Port 3000 - internal)
   - Next.js application
   - Production-optimized build
   - Tailwind CSS styling
   - Bootstrap components
   - **Not exposed externally** - accessed only through nginx

4. **Nginx Proxy** (Port 3000 - external)
   - Single entry point for all traffic
   - Routes `/api/*` to backend internally
   - Routes `/` to frontend internally
   - **Only service exposed externally**
   - Handles SSL/TLS termination

## Architecture Overview

```
┌─────────────────────────────────────────┐
│     External Access (Port 3000)          │
└──────────────────┬──────────────────────┘
                   │
                   ▼
           ┌───────────────┐
           │  Nginx Proxy  │
           └───────┬───────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
┌───────────────┐       ┌───────────────┐
│   Frontend    │       │   Backend     │
│  (Next.js)    │       │  (Express)    │
│   Port 3000   │       │   Port 5000   │
│   Internal    │       │   Internal    │
└───────────────┘       └───────────────┘
```

### Routing Rules

- `/api/*` → Backend (internal network only)
- `/` → Frontend (static pages & Next.js)

### Security Benefits

- Backend is **not** exposed to the internet
- Single entry point (nginx) for all traffic
- Internal network communication only
- Easier SSL/TLS termination at nginx level
- Reduced attack surface

## Management Commands

### View Logs

```bash
# All services (Option 1: --env-file)
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy logs -f

# All services (Option 2: .env.prod)
docker-compose -f docker-compose.prod.yml --env-file .env.prod logs -f

# Specific service
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy logs -f backend
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy logs -f frontend
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy logs -f nginx
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy logs -f postgres
```

### Stop Services

```bash
# Option 1
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy down

# Option 2
docker-compose -f docker-compose.prod.yml --env-file .env.prod down
```

### Restart Services

```bash
# Option 1
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy restart

# Option 2
docker-compose -f docker-compose.prod.yml --env-file .env.prod restart
```

### Check Status

```bash
# Option 1
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy ps

# Option 2
docker-compose -f docker-compose.prod.yml --env-file .env.prod ps
```

### Rebuild Services

```bash
# Option 1
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy up -d --build

# Option 2
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

### Remove All Data (⚠️ Destructive)

```bash
# Option 1
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy down -v

# Option 2
docker-compose -f docker-compose.prod.yml --env-file .env.prod down -v
```

## Configuration

### Environment Variables

Key environment variables in `.env.production`:

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_USER` | Database username | Yes |
| `POSTGRES_PASSWORD` | Database password | Yes |
| `POSTGRES_DB` | Database name | Yes |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Yes |
| `BACKEND_PORT` | Backend port (default: 5000) | No |
| `FRONTEND_PORT` | Frontend port (default: 3000) | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

### Custom Ports

To use custom ports, modify `.env.production`:

```bash
BACKEND_PORT=8000
FRONTEND_PORT=8080
```

## Security Considerations

### Before Production Deployment

1. **Change Default Credentials**
   - Update admin email and password
   - Change database password
   - Generate strong JWT secret

2. **Configure CORS**
   - Update `FRONTEND_URL` with your actual domain
   - Remove localhost from allowed origins

3. **Enable HTTPS**
    - nginx proxy handles SSL/TLS termination
    - Configure SSL certificates (handled by Dokploy/Traefik)
    - Enable secure cookies

4. **Firewall Rules**
    - Only expose nginx port (3000 or 80/443)
    - Database and backend ports are internal-only
    - Configure fail2ban for intrusion prevention
    - Use Dokploy/Traefik for automatic HTTPS

5. **Cloudinary Configuration**
   - Configure upload presets
   - Enable image transformations
   - Set appropriate security settings

## Monitoring

### Health Checks

- **Backend Health**: `GET http://localhost:3000/api/health` (proxied through nginx)
- **Frontend**: `GET http://localhost:3000`
- **Nginx**: `GET http://localhost:3000`
- **Database**: `docker-compose -f docker-compose.prod.yml --env-file .env.dokploy exec postgres pg_isready -U postgres`

### Logs

All logs are available via Docker Compose:

```bash
docker-compose -f docker-compose.prod.yml logs -f
```

## Backup and Restore

### Database Backup

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy exec postgres \
  pg_dump -U postgres trustauto > backup_$(date +%Y%m%d).sql
```

### Database Restore

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy exec -T postgres \
  psql -U postgres trustauto < backup_20240101.sql
```

## Troubleshooting

### Services Won't Start

1. Check port conflicts:
   ```bash
   netstat -tulpn | grep -E ':(3000|5000|5432)'
   ```

2. Check disk space:
   ```bash
   df -h
   ```

3. Check logs:
   ```bash
   docker-compose -f docker-compose.prod.yml logs
   ```

### Database Connection Issues

1. Verify PostgreSQL is running:
    ```bash
    docker-compose -f docker-compose.prod.yml --env-file .env.dokploy exec postgres pg_isready
    ```

2. Check database credentials in `.env.dokploy`

3. Verify network connectivity:
    ```bash
    docker-compose -f docker-compose.prod.yml --env-file .env.dokploy ps
    ```

### API Routes Not Working

1. Check nginx is proxying correctly:
    ```bash
    docker-compose -f docker-compose.prod.yml --env-file .env.dokploy logs nginx
    ```

2. Verify backend is running:
    ```bash
    docker-compose -f docker-compose.prod.yml --env-file .env.dokploy logs backend
    ```

3. Test backend health internally:
    ```bash
    docker-compose -f docker-compose.prod.yml --env-file .env.dokploy exec backend curl http://localhost:5000/health
    ```

### Frontend/Backend Not Connecting

1. Verify `NEXT_PUBLIC_API_URL` in frontend environment (should be `/api`)
2. Check nginx configuration in `nginx.conf`
3. Ensure all services are running:
    ```bash
    docker-compose -f docker-compose.prod.yml --env-file .env.dokploy ps
    ```

### Frontend/Backend Not Connecting

1. Verify `NEXT_PUBLIC_API_URL` in frontend environment
2. Check CORS configuration in backend
3. Ensure both services are running

## Scaling

### Backend Scaling

```bash
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

Note: This requires a load balancer and session store (Redis) in production.

### Database Scaling

For high-traffic deployments, consider:
- PostgreSQL read replicas
- Connection pooling (PgBouncer)
- External managed database (AWS RDS, Google Cloud SQL)

## Production Checklist

- [ ] Change all default passwords
- [ ] Update CORS origins
- [ ] Configure Cloudinary
- [ ] Set up SSL/HTTPS
- [ ] Configure backup strategy
- [ ] Set up monitoring/alerting
- [ ] Configure firewall rules
- [ ] Test health endpoints
- [ ] Verify backup/restore procedures
- [ ] Configure email notifications (optional)

## Support

For issues or questions:
- Check logs: `docker-compose -f docker-compose.prod.yml --env-file .env.dokploy logs -f`
- Review this documentation
- Check individual service logs for errors

### Quick Debug Commands

```bash
# Check all container status
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy ps

# View nginx logs (routing issues)
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy logs nginx

# View backend logs (API issues)
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy logs backend

# Access backend container shell
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy exec backend sh

# Test backend health internally
docker-compose -f docker-compose.prod.yml --env-file .env.dokploy exec backend curl http://localhost:5000/health
```

## License

This application is proprietary. All rights reserved.
