# Traefik/Dökploy Deployment Guide

This guide explains how to deploy TrustAuto Kenya with Traefik reverse proxy on dökploy.

## Overview

With Traefik, the setup works as follows:

```
Internet (443/80)
    ↓
[ Traefik Reverse Proxy ]
    ↓                ↓
[ Frontend ] ← ← [ Backend ] ← [ PostgreSQL ]
   :3000          :5000         :5432
```

## Key Concepts

1. **Frontend**: No external port exposed. Traefik routes HTTP/HTTPS traffic to container port 3000
2. **Backend**: Internal only. Frontend communicates via `http://backend:5000/api` (internal Docker network)
3. **PostgreSQL**: Internal only. Backend communicates via `http://postgres:5432`

## Configuration

### Required Environment Variables

Add these to your deployment environment:

```bash
# Your domain (required for HTTPS)
FRONTEND_HOST=your-domain.com

# Traefik settings
TRAEFIK_CERT_RESOLVER=letsencrypt  # For automatic SSL

# Backend settings
POSTGRES_PASSWORD=strong_password_here
JWT_SECRET=minimum_32_character_secret_here

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### How Communication Works

**Frontend → Backend** (Internal):
```javascript
// frontend/lib/api.ts
// Uses NEXT_PUBLIC_API_URL environment variable
// In Traefik setup: http://backend:5000/api
const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:5000/api';
```

**Traefik → Frontend** (External):
```yaml
# docker-compose.prod.yml labels
traefik.http.routers.frontend.rule=Host(`${FRONTEND_HOST}`)
traefik.http.services.frontend.loadbalancer.server.port=3000
```

## Deploying to Dökploy

1. **Configure Environment** in deployment panel:
   ```bash
   FRONTEND_HOST=your-domain.com
   POSTGRES_PASSWORD=strong_password
   JWT_SECRET=32_character_minimum_secret
   ```

2. **Push code** to your GitHub repository

3. **Deploy** through dökploy - it will:
   - Clone your repository
   - Build Docker images
   - Start containers with docker-compose
   - Traefik automatically routes traffic

## Access URLs

After deployment:

- **Frontend**: `https://your-domain.com`
- **Admin Panel**: `https://your-domain.com/auth/login`
- **Backend API**: Not accessible externally (security)
- **Database**: Not accessible externally (security)

## Troubleshooting

### Frontend Can't Connect to Backend

Check these:

1. **NEXT_PUBLIC_API_URL** environment variable:
   ```bash
   # Should be: http://backend:5000/api
   echo $NEXT_PUBLIC_API_URL
   ```

2. **Both services on same network**:
   ```yaml
   networks:
     - trustauto-network  # Both services must use this
   ```

3. **Service name resolution**:
   ```bash
   # From frontend container, test backend access
   docker exec trustauto-frontend ping backend
   docker exec trustauto-frontend wget -O- http://backend:5000/health
   ```

### Port Already in Use

If you see "port is already allocated":

1. Remove all port exposes from docker-compose.prod.yml
2. Let Traefik handle all external routing
3. Keep only internal Docker networking

### HTTPS Not Working

1. Verify `FRONTEND_HOST` is set correctly
2. Ensure domain DNS points to deployment server
3. Check Traefik logs for certificate errors
4. Verify `TRAEFIK_CERT_RESOLVER=letsencrypt`

### Database Connection Errors

```bash
# Test database from backend container
docker exec trustauto-backend sh -c "wget -O- postgres:5432" || echo "DB reachable"

# Check DATABASE_URL format
docker exec trustauto-backend printenv | grep DATABASE_URL
```

## Security Best Practices

### ✅ This Setup Provides

1. **No exposed database ports** - PostgreSQL only on internal network
2. **No exposed backend API** - Only accessible via frontend
3. **Automatic HTTPS** - Traefik manages SSL certificates
4. **Network isolation** - Services on dedicated Docker network
5. **Rate limiting** - Configure in Traefik dashboard

### Additional Recommendations

1. **Change default admin password** immediately after first login
2. **Use strong secrets** for JWT and database
3. **Enable Traefik dashboard** for monitoring (internal only)
4. **Set up backups** for PostgreSQL volume
5. **Configure firewall rules** on host
6. **Use managed database** (AWS RDS, Google Cloud SQL) for production

## Local Development vs Production

| Aspect | Local Development | Production (Traefik) |
|--------|-------------------|------------------------|
| Frontend access | http://localhost:3000 | https://your-domain.com |
| Backend access | http://localhost:5000 | Internal only |
| API URL | http://localhost:5000/api | http://backend:5000/api |
| Database | localhost:5432 | postgres:5432 (internal) |
| SSL/HTTPS | Not needed | Automatic (LetsEncrypt) |

## Monitoring

### Check Container Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker logs trustauto-backend -f
docker logs trustauto-frontend -f
docker logs trustauto-db -f
```

### Test Internal Communication
```bash
# From frontend container, test backend
docker exec trustauto-frontend wget -q -O- http://backend:5000/health

# From backend container, test database
docker exec trustauto-backend sh -c 'psql -h postgres -U postgres -c "SELECT 1"'
```

## Migration Notes

If migrating from localhost development to Traefik:

1. Update `FRONTEND_URL` in environment to use container names
2. Remove all host port bindings from docker-compose
3. Add Traefik labels for frontend routing
4. Set `FRONTEND_HOST` to your production domain
5. Update frontend `NEXT_PUBLIC_API_URL` to use backend service name
6. Run database migrations on production container

## Support

For dökploy-specific issues, consult dökploy documentation.

For application issues:
1. Check container logs
2. Verify environment variables
3. Test internal networking
4. Review Traefik dashboard
