# Project Overview

## What This Is
Sassy Auto Trading Kenya — car dealership web application allowing the owner to list vehicles, customers to browse and enquire, and admin to manage listings.

## Tech Stack
| Layer      | Technology        | Version | Purpose              |
|------------|-------------------|---------|----------------------|
| Frontend   | Next.js           | 14.2.0  | Public + admin UI    |
| Backend    | Node.js + Express | 4.18.2  | REST API             |
| Database   | SQLite            | -       | Primary data store   |
| ORM        | Prisma            | 5.7.0   | DB access layer      |
| Auth       | JWT               | -       | Session management   |
| Images     | Cloudinary        | -       | Image CDN            |
| Styling    | Tailwind CSS      | 3.4.0   | UI styling           |
| Deployment | Railway + Render  | -       | Backend + Frontend   |

## Repository Structure
```
/backend
  prisma/           # Schema, migrations, seeds
  src/
    app.ts          # Express entry point
    config/         # Database, Cloudinary config
    controllers/    # Request handlers
    middleware/     # Auth, rate limiting, error handling
    routes/         # API route definitions
    services/       # Business logic layer
    utils/          # Helpers (token generation)

/frontend
  app/
    (public)/       # Public pages (dark theme)
      page.tsx      # Homepage
      inventory/    # Car listings
      cars/[slug]/  # Car detail
    admin/          # Admin panel (light theme)
      dashboard/    # Overview
      vehicles/     # CRUD vehicles
      inquiries/    # Customer inquiries
      analytics/    # Stats
      settings/     # App settings
    auth/login/     # Login page
  components/       # Reusable UI components
  lib/              # API client, auth helpers, types
```

## Current Development Status
Active development — pre-deployment phase.
Known issues being actively debugged (see KNOWN_ISSUES.md)
Do not make sweeping refactors. Fix targeted issues only.

## Design System
Public pages: Sassy Dark theme
- --bg-page: #0c0a08
- --bg-card: #1c1814
- --bg-elevated: #161310
- --accent: #c4933f
- --accent-hover: #b08235
- --text-primary: #faf6ef
- --text-secondary: #a09888
- --border: #2d2d2d
- --navbar-height: 80px

Admin pages: Light/blue theme — intentionally separate
Source of truth: frontend/app/globals.css
