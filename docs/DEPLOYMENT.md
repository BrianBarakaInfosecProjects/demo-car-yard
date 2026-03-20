# Deployment Guide

## Target Architecture
```
sassyautotrading.co.ke (Truehost DNS)
        ↓
Render Static (Next.js — free tier)
        ↓
Railway Hobby (Express API — ~$5/mo)
        ↓
SQLite / Neon PostgreSQL
         ↕
Cloudinary CDN (free tier)
```

## Prerequisites
- Node.js 18+ installed
- Railway CLI installed (optional)
- Cloudinary account
- Domain configured (Truehost or similar)

## Pre-Deployment Checklist

### Frontend
- [ ] All API URLs use NEXT_PUBLIC_API_URL env var
- [ ] No hardcoded localhost:5000 URLs
- [ ] npm run build succeeds without errors
- [ ] All images use Cloudinary or proper URLs
- [ ] Environment variables documented

### Backend
- [ ] DATABASE_URL configured for production
- [ ] JWT_SECRET is 64+ characters
- [ ] CORS configured for production frontend URL
- [ ] All env vars set in Railway dashboard
- [ ] npm run build succeeds
- [ ] /health endpoint returns 200

### Database
- [ ] Migrations run successfully
- [ ] Seed data created (admin user)
- [ ] Connection tested from backend

## Deployment Steps

### 1. Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add environment variables in Railway dashboard:
# - DATABASE_URL
# - JWT_SECRET
# - FRONTEND_URL
# - CLOUDINARY_*

# Deploy
railway up

# Run migrations
railway run npx prisma migrate deploy

# Seed database
railway run npx prisma db seed
```

### 2. Deploy Frontend to Render

1. Connect GitHub repository to Render
2. Create new Static Site
3. Build Command: `cd frontend && npm install && npm run build`
4. Publish Directory: `frontend/out`
5. Add environment variables:
   - NEXT_PUBLIC_API_URL (Railway backend URL)
   - NEXT_PUBLIC_SITE_URL (production domain)
   - NEXT_PUBLIC_CLOUDINARY_CLOUD

### 3. Configure Domain (Truehost)

1. Add CNAME record pointing to Render URL
2. Add A record if using apex domain
3. Enable SSL (automatic with Render)

### 4. Post-Deployment Verification

- [ ] Homepage loads correctly
- [ ] Inventory page shows vehicles
- [ ] Admin login works
- [ ] Image uploads work
- [ ] Inquiries submit successfully
- [ ] All API endpoints respond

## Environment Variables

### Railway (Backend)
```
DATABASE_URL=<production-db-url>
JWT_SECRET=<64-char-secret>
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://sassyautotrading.co.ke
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

### Render (Frontend)
```
NEXT_PUBLIC_API_URL=https://<railway-app>.railway.app/api
NEXT_PUBLIC_SITE_URL=https://sassyautotrading.co.ke
NEXT_PUBLIC_CLOUDINARY_CLOUD=<cloud-name>
```

## Monthly Costs Estimate
- Railway Hobby: ~$5/month
- Render Static: Free
- Cloudinary: Free tier
- Truehost domain: ~$5/year
- **Total: ~$5-10/month**

## Rollback Procedure

1. Railway: `railway rollback` or redeploy previous commit
2. Render: Redeploy previous commit from dashboard
3. Database: Restore from backup if needed

## Monitoring

- Railway provides logs and metrics in dashboard
- Render provides deploy logs and analytics
- Set up uptime monitoring (optional): UptimeRobot, Pingdom

## Common Issues

### CORS Errors
- Ensure FRONTEND_URL matches exact domain
- Check protocol (https vs http)
- Verify no trailing slash

### Database Connection
- Verify DATABASE_URL format
- Check SSL requirements
- Ensure IP whitelist allows Railway IPs

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Review build logs for specific errors
