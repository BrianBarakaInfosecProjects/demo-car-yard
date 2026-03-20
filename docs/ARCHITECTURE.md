# System Architecture

## Request Flow
```
Browser → sassyautotrading.co.ke (Truehost DNS)
       → Render Static (Next.js frontend)
       → Railway Hobby (Express API)
       → SQLite (Prisma ORM)
         ↕
       Cloudinary (images, separate CDN)
```

## Frontend Architecture
- Framework:    Next.js 14.2.0 — App Router
- Route groups:
  - `(public)/` — Public-facing pages — uses Navbar + dark theme
  - `admin/` — Admin panel — separate light theme, own layout

- Key files:
  - `frontend/app/(public)/layout.tsx` — shared public layout
  - `frontend/app/admin/layout.tsx` — admin layout
  - `frontend/components/Navbar.tsx` — canonical single navbar
  - `frontend/components/sections/Footer.tsx` — canonical single footer
  - `frontend/app/globals.css` — all CSS variables
  - `frontend/tailwind.config.ts` — all Tailwind aliases
```
## Backend Architecture
- Framework:    Express.js 4.18.2
- Entry point:  `backend/src/app.ts` — Express app setup
- Pattern:      Route → Middleware → Controller → Prisma → DB

- Route structure (see backend/src/routes/):
  - `vehicles.ts` — Vehicle CRUD, search, filters
  - `auth.ts` — Authentication (login/logout/profile)
  - `inquiries.ts` — Customer inquiries CRUD
  - `analytics.ts` — Dashboard stats and audit logs
  - `settings.ts` — App settings (dealer phone)
  - `notifications.ts` — In-app notifications
  - `logs.ts` — Session and audit logs
  - `users.ts` — User management
  - `reservations.ts` — Vehicle reservations with M-Pesa
  - `mpesa.ts` — M-Pesa STK push integration
  - `bulk.ts` — Bulk operations on vehicles
  - `export.ts` — Export reports
  - `carReference.ts` — Car makes/models reference data
  - `notifySubscribers.ts` — Notify me subscriber management
  - `softInterests.ts` — Soft interest leads

- Middleware stack (order applied in app.ts):
  1. Request ID middleware (x-request-id header)
  2. helmet() — security headers
  3. cors() — origin whitelist
  4. express.json() — body parsing
  5. rateLimit (limiter) — applied globally
  6. authMiddleware — applied on protected routes

## Authentication Flow
1. POST /api/auth/login → validates email+password
2. `bcrypt.compare(input, stored_hash)`
3. `jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn })`
4. Token returned to frontend
5. Frontend stores token in localStorage
6. Protected requests send: `Authorization: Bearer <token>`
7. `authMiddleware` verifies token, attaches `req.user`
