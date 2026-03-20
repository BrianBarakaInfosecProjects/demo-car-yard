# Deployment Audit & Production Deployment Guide

**Target Architecture (Budget Stack)**
```
sassyautotrading.co.ke (Truehost DNS - KES 100/mo)
        ↓
Render Static (Next.js frontend - FREE)
        ↓
Railway Hobby (Node.js API - KES 645/mo)
        ↓
Neon Free Tier (PostgreSQL - FREE)
        ↕
Cloudinary (Image CDN - FREE)

Total Monthly Cost: ~KES 745/month
```

---

# PART 1: SECURITY AUDIT

## 1.1 Authentication & Authorization

### Issues Found

| Severity | Issue | File | Fix Required |
|----------|-------|------|--------------|
| 🔴 CRITICAL | JWT secret has fallback default value | `backend/src/utils/token.ts:3` | Remove fallback, fail if not set |
| 🔴 CRITICAL | Auth rate limiter allows 10,000 attempts | `backend/src/middleware/rateLimiter.ts:20` | Reduce to 5-10 attempts |
| 🟡 MEDIUM | Password minimum length is 6 chars | `backend/src/utils/validators.ts:6` | Increase to 8+ chars |
| 🟡 MEDIUM | No password complexity requirements | `backend/src/utils/validators.ts` | Add regex for complexity |
| 🟢 LOW | Token stored in localStorage (XSS vulnerable) | `frontend/lib/auth.ts` | Consider httpOnly cookies |

### Required Fixes

**1. Fix JWT Secret (CRITICAL)**
```typescript
// backend/src/utils/token.ts
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
```

**2. Fix Auth Rate Limiter (CRITICAL)**
```typescript
// backend/src/middleware/rateLimiter.ts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per 15 minutes
  // ... rest
});
```

**3. Add Password Complexity (MEDIUM)**
```typescript
// backend/src/utils/validators.ts
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');
```

---

## 1.2 Input Validation & Sanitization

### Status: ✅ GOOD

- Zod schemas for validation ✅
- express-validator for sanitization ✅
- Input escaping on text fields ✅

### Minor Issues

| Severity | Issue | File | Fix |
|----------|-------|------|-----|
| 🟢 LOW | No file type validation on upload | `cloudinaryUpload.ts` | Add MIME type check |
| 🟢 LOW | No file size limit explicit | `cloudinaryUpload.ts` | Add maxSize option |

---

## 1.3 CORS & Security Headers

### Status: ✅ MOSTLY GOOD

**Helmet is configured** ✅
**CORS is configured with whitelist** ✅

### Issues

| Severity | Issue | Fix |
|----------|-------|-----|
| 🟡 MEDIUM | CORS logs blocked origins to console | Remove in production |
| 🟡 MEDIUM | Hardcoded GitHub Codespaces URLs | Remove before deploy |

**Fix CORS Configuration:**
```typescript
// backend/src/app.ts - Remove these from production
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  // REMOVE these in production:
  // 'https://opulent-orbit-694pjg559vqph4px5-3000.app.github.dev',
];
```

---

## 1.4 Rate Limiting

### Current Configuration

| Route | Window | Max Requests | Status |
|-------|--------|--------------|--------|
| Global | 15 min | 100 | ✅ OK |
| Auth | 15 min | 10,000 | 🔴 TOO HIGH |
| Inquiry | 15 min | 5 | ✅ OK |

**Fix authLimiter max to 5** (see section 1.1)

---

## 1.5 Database Security

### Current: SQLite (Development)
### Target: Neon PostgreSQL (Production)

### Migration Required

1. **Update Prisma schema** for PostgreSQL:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

2. **Add connection pooling** for serverless:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

3. **Regenerate Prisma client** after schema change:
```bash
npx prisma generate
```

---

## 1.6 Console Logs & Debug Info

### Issues Found: 30+ console.log/error statements

**Production Risk:** Information leakage, performance impact

### Action Required
Remove or guard all console.log statements:
```typescript
// Before
console.log('Files received:', files?.length);

// After
if (process.env.NODE_ENV === 'development') {
  console.log('Files received:', files?.length);
}
```

**Files needing cleanup:**
- `backend/src/controllers/vehicleController.ts` (12 occurrences)
- `backend/src/middleware/audit.ts` (4 occurrences)
- `backend/src/app.ts` (2 occurrences)

---

## 1.7 Environment Variables

### Backend Required Variables

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | ✅ | Neon pooled connection |
| `DIRECT_URL` | ✅ | Neon direct connection (migrations) |
| `JWT_SECRET` | ✅ | 64+ random chars |
| `JWT_EXPIRES_IN` | ✅ | e.g., "7d" |
| `NODE_ENV` | ✅ | "production" |
| `PORT` | ✅ | Railway injects |
| `FRONTEND_URL` | ✅ | https://sassyautotrading.co.ke |
| `CLOUDINARY_CLOUD_NAME` | ✅ | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | ✅ | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | ✅ | From Cloudinary dashboard |
| `MPESA_*` | Optional | Only if using M-Pesa |

### Frontend Required Variables

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_API_URL` | ✅ | https://[railway-app].railway.app/api |
| `NEXT_PUBLIC_SITE_URL` | ✅ | https://sassyautotrading.co.ke |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD` | ✅ | Cloud name for image URLs |

---

## 1.8 File Upload Security

### Current: Cloudinary (Good)

✅ Files uploaded to Cloudinary (not local filesystem)
✅ Image transformations applied
✅ Public IDs tracked for deletion

### Recommendations

```typescript
// Add explicit limits in cloudinaryUpload.ts
const uploadOptions = {
  folder: 'vehicles',
  resource_type: 'image',
  allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  max_file_size: 5 * 1024 * 1024, // 5MB
  transformation: [{ quality: 'auto:best' }],
};
```

---

## 1.8 Type Errors After Schema Change

**IMPORTANT:** After switching from SQLite to PostgreSQL, you following code changes are required:

### Known Issues to Fix

1. **Field name changes:**
   - `price` → `priceKES` (check exportController.ts, vehicleService.ts)
   - `colour` → `exteriorColor` (check vehicleService.ts)
   - `reservedUntil` was removed from schema

2. **Images field type mismatch:**
   - Schema defines `images: String` (JSON string)
   - Code passes `string[]` directly
   - Fix: Use `JSON.stringify()` when saving, `JSON.parse()` when reading

3. **Search mode option:**
   - `mode: 'insensitive'` is not valid for PostgreSQL StringFilter
   - Remove or use proper PostgreSQL full-text search

### Quick Fix Commands
```bash
# Find and fix price field references
grep -rn "price:" backend/src --include="*.ts"
grep -rn "\.price" backend/src --include="*.ts"

# Find and fix images type issues  
grep -rn "images:" backend/src --include="*.ts"
```

---

# PART 2: PRE-DEPLOYMENT CHECKLIST

## 2.1 Backend Checklist

- [ ] **Change database to PostgreSQL**
  - [ ] Update `schema.prisma` provider to `postgresql`
  - [ ] Add `directUrl` for Neon
  - [ ] Run `npx prisma generate`

- [ ] **Fix TypeScript errors after Schema migration**
  The following files have TypeScript errors that must be manually fixed when deploying:
  because the schema changed from SQLite (loose typing) to PostgreSQL (strict typing):
  1. `backend/src/controllers/exportController.ts` - Change `price` to `priceKES`
  2. `backend/src/routes/mpesa.ts` - Remove `reservedUntil` field (doesn't exist)
  3. `backend/src/routes/reservations.ts` - Remove `reservedUntil` field (doesn't exist)
  4. `backend/src/routes/vehicles.ts` - Create missing `notifySubscriberController`
  5. `backend/src/services/bulkOperationService.ts` - Fix `images` type (use JSON.stringify)
  6. `backend/src/services/vehicleService.ts` - Multiple fixes:
     - Fix `images` field type (string vs string[])
     - Fix `colour` → `exteriorColor`
     - Remove `mode: 'insensitive'` from search (PostgreSQL doesn't support)
     - Fix `imagePublicIds` type
     - Fix `reservedUntil` field (doesn't exist)
  7. `backend/tests/setup.ts` - Add `beforeAll, import from jest-globals
  8. `backend/tsconfig.json` - Add jest types
  9. `backend/tsconfig.test.json` - Create test-specific TypeScript config
- [ ] **Security fixes**
  - [ ] Remove JWT secret fallback (token.ts)
  - [ ] Reduce auth rate limit to 5 attempts (rateLimiter.ts)
  - [ ] Add password complexity validation (validators.ts)
  - [ ] Remove CORS debug logs and hardcoded URLs (app.ts)
- [ ] **Environment variables**
  - [ ] Create production `.env` (do NOT commit)
  - [ ] Verify all required vars are set
  - [ ] JWT_SECRET is 64+ characters
- [ ] **Build and test**
  ```bash
  cd backend
  npm run build
  ```

## 2.2 Frontend Checklist
- [ ] **API URLs**
  - [ ] No hardcoded `localhost:5000` in code
  - [ ] All fetches use `NEXT_PUBLIC_API_URL`
- [ ] **Static export configuration**
  - [ ] `next.config.js` has `output: 'export'` (for static)
  - OR `output: 'standalone'` (for Node.js server)
- [ ] **Images**
  - [ ] All `remotePatterns` configured
  - [ ] Using Cloudinary for uploads
- [ ] **Build and test**
  ```bash
  cd frontend
  npm run build
  npm run lint
  ```

## 2.2 Frontend Checklist

- [ ] **API URLs**
  - [ ] No hardcoded `localhost:5000` in code
  - [ ] All fetches use `NEXT_PUBLIC_API_URL`

- [ ] **Static export configuration**
  - [ ] `next.config.js` has `output: 'export'` (for static)
  - OR `output: 'standalone'` (for Node.js server)

- [ ] **Images**
  - [ ] All `remotePatterns` configured
  - [ ] Using Cloudinary for uploads

- [ ] **Build and test**
  ```bash
  cd frontend
  npm run build
  npm run lint
  ```

## 2.3 Database Migration Checklist

- [ ] Create Neon account at https://neon.tech
- [ ] Create new project
- [ ] Copy connection strings
- [ ] Run migrations:
  ```bash
  npx prisma migrate deploy
  npx prisma db seed
  ```

---

# PART 3: STEP-BY-STEP DEPLOYMENT

## 3.1 Setup Neon PostgreSQL

1. Go to https://neon.tech and create account
2. Create new project: "sassy-auto-trading"
3. Copy connection strings from dashboard:
   - **Connection string** → `DATABASE_URL`
   - **Direct connection** → `DIRECT_URL`

4. Update `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl  = env("DIRECT_URL")
}
```

5. Regenerate Prisma client:
```bash
cd backend
npx prisma generate
```

---

## 3.2 Deploy Backend to Railway

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login to Railway:**
```bash
railway login
```

3. **Create new project:**
```bash
cd backend
railway init
# Select "Empty Project"
```

4. **Add PostgreSQL (optional - we use Neon):**
   - Skip this if using Neon

5. **Set environment variables in Railway dashboard:**

Go to your project → Settings → Variables:

```
DATABASE_URL=postgresql://[user]:[pass]@[host]/[db]?sslmode=require
DIRECT_URL=postgresql://[user]:[pass]@[host]/[db]?sslmode=require
JWT_SECRET=[your-64-char-secret-here]
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://sassyautotrading.co.ke
CLOUDINARY_CLOUD_NAME=[your-cloud-name]
CLOUDINARY_API_KEY=[your-api-key]
CLOUDINARY_API_SECRET=[your-api-secret]
```

6. **Deploy:**
```bash
railway up
```

7. **Generate public URL:**
```bash
railway domain
```
Note this URL (e.g., `https://sassy-auto-production.up.railway.app`)

8. **Run database migrations:**
```bash
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

9. **Verify deployment:**
```bash
curl https://[your-railway-url]/health
```

---

## 3.3 Deploy Frontend to Render

### Option A: Static Export (Recommended for budget)

1. **Update `next.config.js`:**
```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};
```

2. **Go to https://render.com and sign up/login**

3. **Create new Static Site:**
   - Connect GitHub repository
   - Select your repo
   - Configure:
     - **Name:** sassy-auto-frontend
     - **Build Command:** `cd frontend && npm install && npm run build`
     - **Publish Directory:** `frontend/out`
     - **Branch:** main

4. **Add environment variables:**
```
NEXT_PUBLIC_API_URL=https://[your-railway-url]/api
NEXT_PUBLIC_SITE_URL=https://sassyautotrading.co.ke
NEXT_PUBLIC_CLOUDINARY_CLOUD=[your-cloud-name]
```

5. **Deploy and wait for build**

6. **Note your Render URL** (e.g., `https://sassy-auto-frontend.onrender.com`)

### Option B: Node.js Server (More features)

If you need SSR/ISR features:

1. Keep `output: 'standalone'`
2. Create as **Web Service** (not Static Site)
3. Start Command: `node server.js`

---

## 3.4 Configure Domain (Truehost)

1. **Login to Truehost client area**

2. **Go to Domain Management → DNS Settings**

3. **Add CNAME record for apex domain:**
   - **Name:** `@` or leave blank
   - **Type:** CNAME
   - **Value:** `[your-render-url].onrender.com`
   - **TTL:** 3600

4. **Add CNAME for www:**
   - **Name:** `www`
   - **Type:** CNAME
   - **Value:** `[your-render-url].onrender.com`
   - **TTL:** 3600

5. **Wait for DNS propagation** (up to 24 hours, usually 1-2 hours)

6. **Verify:**
```bash
nslookup sassyautotrading.co.ke
dig sassyautotrading.co.ke
```

---

## 3.5 Configure Custom Domain in Render

1. Go to your Render static site
2. Settings → Custom Domains
3. Add `sassyautotrading.co.ke`
4. Add `www.sassyautotrading.co.ke`
5. Render will verify and issue SSL automatically

---

## 3.6 Update CORS for Production

1. In Railway, update `FRONTEND_URL`:
```
FRONTEND_URL=https://sassyautotrading.co.ke,https://www.sassyautotrading.co.ke
```

2. Redeploy backend:
```bash
railway up
```

---

## 3.7 Final Verification

### Test Checklist

- [ ] Homepage loads at https://sassyautotrading.co.ke
- [ ] Inventory page shows vehicles
- [ ] Car detail pages work
- [ ] Admin login works at https://sassyautotrading.co.ke/auth/login
- [ ] Can create/edit vehicles in admin
- [ ] Images upload to Cloudinary
- [ ] Inquiries submit successfully
- [ ] No CORS errors in browser console
- [ ] SSL certificate is valid
- [ ] Mobile responsive

### Health Check Commands

```bash
# Backend health
curl https://[railway-url]/health

# API vehicles endpoint
curl https://[railway-url]/api/vehicles

# Frontend loads
curl -I https://sassyautotrading.co.ke
```

---

# PART 4: POST-DEPLOYMENT

## 4.1 Monitoring Setup

### Railway Monitoring (Built-in)
- View logs: `railway logs`
- Dashboard metrics available

### Uptime Monitoring (Free)
- https://uptimerobot.com - Free tier, 5-minute checks
- Add monitors for:
  - https://sassyautotrading.co.ke
  - https://[railway-url]/health

### Error Tracking (Optional)
- Consider Sentry for error tracking (free tier available)

## 4.2 Backup Strategy

### Database Backups
- Neon provides automatic backups (free tier: 1 day retention)
- For additional safety, periodic exports:
```bash
railway run npx prisma db pull
railway run npx prisma db execute --file=backup.sql
```

### Code Backups
- GitHub repository is source of truth
- Enable branch protection on `main`

## 4.3 Security Maintenance

### Regular Tasks
- [ ] Update npm packages monthly
- [ ] Rotate JWT_SECRET quarterly
- [ ] Review access logs weekly
- [ ] Check for security advisories:
  ```bash
  npm audit
  ```

## 4.4 Troubleshooting

### Common Issues

**CORS Errors:**
- Check `FRONTEND_URL` matches exact domain
- Verify protocol (https vs http)
- No trailing slash

**Database Connection:**
- Verify Neon isn't suspended (free tier sleeps)
- Check SSL mode in connection string
- Verify IP allowlist (Neon allows all by default)

**Build Failures:**
- Check Node.js version (18+)
- Verify all dependencies in package.json
- Review build logs

**Images Not Loading:**
- Verify Cloudinary credentials
- Check `remotePatterns` in next.config.js
- Ensure images use Cloudinary URLs

---

# PART 5: ROLLBACK PROCEDURE

## 5.1 Backend Rollback

```bash
# View deployment history
railway status

# Rollback to previous deployment
railway rollback
```

## 5.2 Frontend Rollback

1. Go to Render dashboard
2. Select your static site
3. Go to "Deploys" tab
4. Click "Rollback" on previous successful deploy

## 5.3 Database Rollback

```bash
# If you have a backup
railway run npx prisma migrate resolve --rolled-back [migration-name]
```

---

# APPENDIX A: Quick Reference Commands

```bash
# Local Development
cd backend && npm run dev
cd frontend && npm run dev

# Build
npm run build

# Database
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npx prisma studio

# Railway
railway login
railway init
railway up
railway logs
railway domain
railway run [command]

# Testing
npm test
npm run lint
```

---

# APPENDIX B: Cost Breakdown

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Railway Hobby | Paid | KES 645 (~$5) |
| Render Static | Free | KES 0 |
| Neon PostgreSQL | Free | KES 0 |
| Cloudinary | Free | KES 0 |
| Truehost .co.ke | - | KES 100 (~$0.80) |
| **TOTAL** | | **~KES 745/month** |

### Limits (Free Tiers)
- **Render Static:** 100GB bandwidth/month
- **Neon:** 0.5GB storage, auto-suspend after inactivity
- **Cloudinary:** 25GB storage, 25GB bandwidth/month

---

*Document generated: March 2026*
*Architecture based on: budget_stack_architecture.svg*
