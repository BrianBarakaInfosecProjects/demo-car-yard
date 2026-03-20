# Known Issues & Active Bugs

## Status Key
🔴 CRITICAL — broken, blocking user flow
🟡 ACTIVE   — known bug, being fixed
🟢 FIXED    — resolved, keeping for record
🔵 DEFERRED — known, not prioritized yet

## Current Issues

| # | Status | Area      | Description                            | File/Line          |
|---|--------|-----------|----------------------------------------|--------------------|
| 1 | 🟢     | Backend   | viewCount field was named 'views'      | vehicleController  |
| 2 | 🟢     | Backend   | Hardcoded userId in notifications      | routes/notifications.ts |
| 3 | 🟢     | Frontend  | Login form missing onSubmit handler    | admin/login/page   |
| 4 | 🟢     | Frontend  | Inventory page infinite loading loop   | inventory/page.tsx |
| 5 | 🟢     | Frontend  | Price showing "KES KSh" double prefix  | inventory/page.tsx |
| 6 | 🟢     | Frontend  | White circle on carousel arrows        | inventory/page.tsx |
| 7 | 🟢     | Frontend  | Duplicate navbar on car detail page    | cars/[slug]/page   |
| 8 | 🟢     | Auth      | Token not persisted across refresh     | lib/auth.ts        |

## Recently Fixed (Do Not Regress)

### viewCount Field Naming
- Issue: Field was incorrectly referenced as `views` instead of `viewCount`
- Fixed in: backend/src/controllers/vehicleController.ts
- Fix: Changed `data: { views: { increment: 1 } }` to `data: { viewCount: { increment: 1 } }`
- ⚠️ Never change this back

### Admin Login Flow
- Issue: Login form was broken, onSubmit handler was missing
- Fixed in: frontend/app/auth/login/page.tsx
- Fix: Added proper form submission with api.post('/auth/login')
- ⚠️ Do not remove the handleSubmit function

### Inventory Page Data Loading
- Issue: Infinite re-render loop when fetching vehicles
- Fixed in: frontend/app/(public)/inventory/page.tsx
- Fix: Proper useEffect dependencies and state management
- ⚠️ Do not add vehicles to useEffect dependency array

### Price Display
- Issue: Price showed "KES KSh" instead of just "KSh"
- Fixed in: Multiple components using formatPrice utility
- Fix: Standardized price formatting in lib/utils.ts
- ⚠️ Always use formatPrice() for prices

### Navbar Duplication
- Issue: Multiple Navbar components rendered on same page
- Fixed in: Layout files, removed duplicate imports
- Fix: Single Navbar in (public)/layout.tsx only
- ⚠️ Never add Navbar inside page components

### Dark Theme on Public Pages
- Issue: Some components used light theme or hardcoded colors
- Fixed in: globals.css and component files
- Fix: Use CSS variables for all colors
- ⚠️ Never hardcode hex colors in components

## Do Not Break
These areas were recently fixed and must not be regressed:
- Admin login flow (was broken, now working)
- Inventory page data loading (was in infinite loop)
- viewCount increment on vehicle view
- Navbar anchor links working from all pages
- Footer dark theme on public pages
- Single canonical Navbar and Footer components
- Token stored in localStorage, retrieved correctly

## Deferred Issues (Not Priority)

| # | Status | Area      | Description                            |
|---|--------|-----------|----------------------------------------|
| 1 | 🔵     | Testing   | No integration tests — unit tests only |
| 2 | 🔵     | Auth      | No refresh token mechanism             |
| 3 | 🔵     | Images    | No image optimization on upload        |
| 4 | 🔵     | SEO       | Missing sitemap.xml                    |
| 5 | 🔵     | PWA       | Service worker not fully implemented   |
