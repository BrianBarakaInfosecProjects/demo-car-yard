# TrustAuto Kenya - Git Clone Instructions

## 📦 For Local Development in VS Code

### 1. Clone the Repository

```bash
git clone <repository-url>
cd demo-car-yard
```

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

### 3. Setup Backend

```bash
cd backend
cp ../.env.example .env
npm install
npm run dev
```

Backend runs at: **http://localhost:5000**

### 4. Setup Frontend (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

### 5. Database Setup (First Time Only)

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

## 🔐 Login Credentials

```
Email:    admin@trustauto.co.ke
Password:  Admin123!
```

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health
- **Admin Login**: http://localhost:3000/auth/login

## 📊 Database Summary

- **Total Vehicles**: 25 (24 demo + 1 test vehicle)
- **Admin Users**: 1
- **Tables**: users, vehicles, inquiries

## 🎨 UI Verification

### Original Demo Elements Implemented:

✅ **Navbar** - Fixed positioning, smooth scroll, hamburger menu
✅ **Hero Section** - Gradient background, search form
✅ **Stats Section** - Animated stat cards
✅ **Vehicle Cards** - Pixel-perfect match with:
  - Image hover zoom effect
  - Status badges (Featured, On Sale, etc.)
  - Meta grid (make, color, year, fuel, etc.)
  - Contact buttons (WhatsApp, Phone, Email, Details)
✅ **Vehicle Filters** - Make, price range, body type, fuel type
✅ **Sorting** - Price, year, brand
✅ **Vehicle Modal** - Full specifications table
✅ **Services Section** - 4 service cards
✅ **Footer** - Contact info, links, social media
✅ **WhatsApp Float** - Animated floating button
✅ **Responsive Design** - Mobile-optimized

### Pages Available:

#### Public Pages
- `/` - Homepage
- `/inventory` - Vehicle listing (25 vehicles)
- `/services` - Services overview
- `/contact` - Contact form

#### Admin Pages
- `/auth/login` - Admin login
- `/auth/register` - Admin registration
- `/admin/dashboard` - Dashboard with statistics
- `/admin/vehicles` - Vehicle management (CRUD)
- `/admin/vehicles/new` - Add new vehicle
- `/admin/vehicles/[id]` - Edit vehicle
- `/admin/inquiries` - Inquiry management

## 🧪 Testing

### Verify UI Matches Original Demo

Open both files side-by-side in VS Code:

**Left Panel**: `sample.html` (original demo)
**Right Panel**: Visit http://localhost:3000

Compare:
- Navbar styles and behavior
- Hero section gradient and layout
- Vehicle card hover effects and animations
- Contact button colors and sizes
- Modal styling
- Footer layout
- WhatsApp float button animation

### Test Admin Functionality

1. Go to http://localhost:3000/auth/login
2. Login with: `admin@trustauto.co.ke` / `Admin123!`
3. Navigate to http://localhost:3000/admin/vehicles
4. You should see **25 vehicles** (24 demo + 1 test "Test" vehicle)
5. Click "Add Vehicle" to create a new vehicle
6. Fill out the form and submit
7. Verify the new vehicle appears in the list
8. Go to http://localhost:3000/inventory
9. The new vehicle should appear in the public inventory

## 🐛 Common Issues

### Backend Won't Start
```bash
# Check if port 5000 is in use
lsof -ti:5000

# Kill process if needed
kill -9 <PID>
```

### Frontend Won't Build
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Database Connection Error
```bash
# Restart PostgreSQL
docker-compose restart postgres

# Verify connection
cd backend
npx prisma db push
```

### Vehicles Not Showing on Frontend

1. Check API is accessible: curl http://localhost:5000/api/vehicles
2. Check browser console for errors (F12)
3. Verify NEXT_PUBLIC_API_URL is correct in .env
4. Check if CORS is blocking requests

### Admin Not Working

1. Verify token is set in localStorage after login
2. Check API response in Network tab (F12)
3. Confirm JWT_SECRET matches between .env files
4. Check backend logs: tail -f /tmp/backend.log

## 📝 Environment Files

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/trustauto"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (No .env needed in development)
```bash
# In production, create frontend/.env:
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

## 🔧 Development Workflow

### Make Changes to Backend

1. Edit files in `backend/src/`
2. Backend auto-restarts with ts-node-dev
3. Test changes at http://localhost:5000/api

### Make Changes to Frontend

1. Edit files in `frontend/app/` or `frontend/components/`
2. Next.js hot-reloads automatically
3. Test changes at http://localhost:3000

### Reset Database

```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

## 🎯 Current Status

### ✅ Working Features
- Backend API running on port 5000
- Frontend running on port 3000
- PostgreSQL database running
- 25 vehicles in database (24 demo + 1 test)
- Admin authentication working
- Vehicle CRUD via admin panel
- All vehicle cards implemented (pixel-perfect match)

### 📊 Test Vehicle Created
```json
{
  "id": "e3060c38-26bf-4c76-8286-2336d6d38332",
  "make": "Test",
  "model": "Test Model",
  "year": 2025,
  "priceKES": 5000000,
  "bodyType": "SEDAN",
  "fuelType": "GASOLINE",
  "transmission": "Automatic",
  "drivetrain": "FWD",
  "exteriorColor": "Test Color",
  "interiorColor": "Black",
  "engine": "2.0L I4",
  "vin": "TESTVIN123456789",
  "status": "USED",
  "featured": false,
  "description": "Test vehicle added via API",
  "imageUrl": "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "createdAt": "2026-01-13T13:13:51.530Z",
  "updatedAt": "2026-01-13T13:13:51.530Z"
}
```

This vehicle should now appear on:
- Admin: http://localhost:3000/admin/vehicles
- Public: http://localhost:3000/inventory

## 🚀 Ready to Develop

Open VS Code:
1. File > Open Folder
2. Select `/workspaces/demo-car-yard`
3. Start editing!

All services are running and ready for local development.
