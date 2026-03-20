# Frontend Pages & Components

## Public Routes (dark Sassy theme)

| Route              | File                                    | Purpose              |
|--------------------|-----------------------------------------|----------------------|
| /                  | app/(public)/page.tsx                   | Homepage             |
| /inventory         | app/(public)/inventory/page.tsx         | Car listings         |
| /cars/[slug]       | app/(public)/cars/[slug]/page.tsx       | Car detail           |

## Auth Routes

| Route              | File                                    | Purpose              |
|--------------------|-----------------------------------------|----------------------|
| /auth/login        | app/auth/login/page.tsx                 | Admin login          |

## Admin Routes (light theme)

| Route                    | File                              | Purpose           |
|--------------------------|-----------------------------------|-------------------|
| /admin/dashboard         | app/admin/dashboard/page.tsx      | Overview          |
| /admin/vehicles          | app/admin/vehicles/page.tsx       | Manage listings   |
| /admin/vehicles/new      | app/admin/vehicles/new/page.tsx   | Add vehicle       |
| /admin/vehicles/[id]     | app/admin/vehicles/[id]/page.tsx  | Edit vehicle      |
| /admin/inquiries         | app/admin/inquiries/page.tsx      | Customer inquiries|
| /admin/settings          | app/admin/settings/page.tsx       | App settings      |
| /admin/analytics         | app/admin/analytics/page.tsx      | Stats             |
| /admin/logs              | app/admin/logs/page.tsx           | Activity logs     |
| /admin/featured          | app/admin/featured/page.tsx       | Featured vehicles |
| /admin/profile           | app/admin/profile/page.tsx        | User profile      |

## Layout Structure

Public Layout: `frontend/app/(public)/layout.tsx`
- Renders Navbar component
- Main content with paddingTop: var(--navbar-height)
- Footer component

Admin Layout: `frontend/app/admin/layout.tsx`
- Wraps AdminLayout component from components/admin/AdminLayout.tsx
- Light/blue theme (intentionally different from public)
- Does NOT use public Navbar or Footer

## Shared Components

| Component                      | Purpose                            |
|--------------------------------|------------------------------------|
| components/Navbar.tsx          | Single canonical public navbar     |
| components/sections/Footer.tsx | Single canonical public footer     |
| components/ShareButton.tsx     | Web Share API — all public pages   |
| components/WhatsAppFloat.tsx   | Floating WhatsApp button           |
| components/DealerPhone.tsx     | Dealer phone display               |
| components/ScrollPositionManager.tsx | Scroll restoration          |
| components/NavigationButtons.tsx | Back/forward navigation          |

## Vehicle Components

| Component                      | Purpose                            |
|--------------------------------|------------------------------------|
| components/vehicles/VehicleCard.tsx | Car card for grid            |
| components/vehicles/VehicleModal.tsx | Quick view modal            |
| components/vehicles/VehicleSkeleton.tsx | Loading placeholder      |
| components/vehicle/VehicleGallery.tsx | Image carousel            |
| components/vehicle/VehicleHeader.tsx | Detail page header          |
| components/vehicle/VehicleSpecsTabs.tsx | Specs accordion          |
| components/vehicle/SimilarVehicles.tsx | Related cars             |

## Admin Components

| Component                      | Purpose                            |
|--------------------------------|------------------------------------|
| components/admin/AdminLayout.tsx | Admin wrapper (light theme)      |

## Inventory Components

| Component                      | Purpose                            |
|--------------------------------|------------------------------------|
| components/inventory/InventoryFilters.tsx | Filter controls         |
| components/inventory/SearchAutocomplete.tsx | Search suggestions    |
| components/inventory/BudgetFilter.tsx | Price range filter          |

## Section Components

| Component                      | Purpose                            |
|--------------------------------|------------------------------------|
| components/sections/Hero.tsx   | Homepage hero section              |
| components/sections/FeaturedVehicles.tsx | Featured cars grid        |
| components/sections/FindYourPerfectCar.tsx | Filter section        |
| components/sections/Services.tsx | Services section                 |

## Design Token Reference
All tokens defined in frontend/app/globals.css
All Tailwind aliases in frontend/tailwind.config.ts

Color tokens (use these, NEVER hardcode hex):
- bg-bg-page, bg-bg-card, bg-bg-elevated
- text-text-primary, text-text-secondary, text-accent
- border-border-subtle
- bg-accent, hover:bg-accent-hover

Button sizes:
- Default: py-2 px-5 text-sm font-semibold
- Small: py-1.5 px-3.5 text-[13px] font-semibold
- Large (hero only): py-3 px-7 text-[15px] font-semibold
- NEVER use: py-4, py-5, py-6 on buttons

## Key Files

| File                                      | Purpose                            |
|-------------------------------------------|------------------------------------|
| frontend/lib/api.ts                       | API client with axios              |
| frontend/lib/auth.ts                      | Token management (localStorage)    |
| frontend/lib/types.ts                     | TypeScript interfaces              |
| frontend/lib/cloudinary.ts                | Image URL helpers                  |
| frontend/lib/useURLFilters.ts             | URL-based filter state hook        |
| frontend/lib/utils.ts                     | Utility functions                  |
