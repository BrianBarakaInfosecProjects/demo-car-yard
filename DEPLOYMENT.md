# Production Deployment Guide

This guide explains how to deploy the TrustAuto Kenya application in production using Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- At least 2GB of RAM available
- 10GB of free disk space

## Quick Start

### 1. Configure Environment Variables

Copy the production environment template:

```bash
cp .env.production .env
```

Edit `.env` and update these critical values:

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

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3. Verify Deployment

Access the application:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/auth/login

Default admin credentials:
- Email: `admin@trustauto.co.ke`
- Password: `Admin123!`

⚠️ **IMPORTANT**: Change the default admin password after first login!

## Services Overview

The production setup includes three services:

1. **PostgreSQL Database** (Port 5432)
   - Persistent data storage
   - Automated health checks
   - Volume-backed data persistence

2. **Backend API** (Port 5000)
   - Node.js/Express API
   - Prisma ORM with PostgreSQL
   - JWT authentication
   - Health endpoint at `/health`

3. **Frontend** (Port 3000)
   - Next.js application
   - Production-optimized build
   - Tailwind CSS styling
   - Bootstrap components

## Management Commands

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### Stop Services

```bash
docker-compose -f docker-compose.prod.yml down
```

### Restart Services

```bash
docker-compose -f docker-compose.prod.yml restart
```

### Check Status

```bash
docker-compose -f docker-compose.prod.yml ps
```

### Rebuild Services

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Remove All Data (⚠️ Destructive)

```bash
docker-compose -f docker-compose.prod.yml down -v
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
   - Use reverse proxy (nginx/traefik)
   - Configure SSL certificates
   - Enable secure cookies

4. **Firewall Rules**
   - Restrict database port (5432) to internal network
   - Only expose necessary ports (80, 443)
   - Configure fail2ban for intrusion prevention

5. **Cloudinary Configuration**
   - Configure upload presets
   - Enable image transformations
   - Set appropriate security settings

## Monitoring

### Health Checks

- **Backend Health**: `GET http://localhost:5000/health`
- **Frontend**: `GET http://localhost:3000`
- **Database**: `docker-compose exec postgres pg_isready -U postgres`

### Logs

All logs are available via Docker Compose:

```bash
docker-compose -f docker-compose.prod.yml logs -f
```

## Backup and Restore

### Database Backup

```bash
docker-compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U postgres trustauto > backup_$(date +%Y%m%d).sql
```

### Database Restore

```bash
docker-compose -f docker-compose.prod.yml exec -T postgres \
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
   docker-compose -f docker-compose.prod.yml exec postgres pg_isready
   ```

2. Check database credentials in `.env.production`

3. Verify network connectivity:
   ```bash
   docker-compose -f docker-compose.prod.yml ps
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
- Check logs: `docker-compose -f docker-compose.prod.yml logs -f`
- Review this documentation
- Check individual service logs for errors

## License

This application is proprietary. All rights reserved.
