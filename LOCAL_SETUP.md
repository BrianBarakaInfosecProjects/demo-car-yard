# TrustAuto Kenya - Local Development Setup

## 📦 Prerequisites

Before cloning, ensure you have:
- **Git** - For version control
- **Node.js 18+** - JavaScript runtime
- **VS Code** - Recommended IDE
- **PostgreSQL** - Running via Docker (included)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
# If you have git access
git clone <repository-url>
cd demo-car-yard

# Or if you're copying files
# Ensure all files are in this directory structure
```

### 2. Start PostgreSQL (Docker)

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify it's running
docker ps

# View logs
docker-compose logs -f postgres
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies (if needed)
npm install

# Copy environment file (if needed)
cp .env.example .env

# Edit .env and verify DATABASE_URL
# Default: DATABASE_URL="postgresql://postgres:password@localhost:5432/trustauto"

# Run database migrations
npx prisma migrate dev

# Start backend server
npm run dev
```

Backend will run on: **http://localhost:5000**

### 4. Setup Frontend

```bash
# Open new terminal
cd frontend

# Install dependencies (if needed)
npm install

# Start frontend server
npm run dev
```

Frontend will run on: **http://localhost:3000** (or 3001 if 3000 is in use)

## 🔐 Admin Credentials

```
Email:    admin@trustauto.co.ke
Password:  Admin123!
```

## 📁 Project Structure in VS Code

When you open this project in VS Code, you'll see:

```
demo-car-yard/
├── backend/              # Express API (Node.js + TypeScript + Prisma)
│   ├── src/
│   │   ├── config/      # Database, multer config
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth, validation, error handling
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helpers
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts        # Demo data (24 vehicles)
│   ├── uploads/           # Image uploads
│   └── package.json
│
├── frontend/            # Next.js 14 Frontend
│   ├── app/              # Pages (App Router)
│   │   ├── (marketing)/  # Public pages
│   │   ├── (auth)/       # Login/Register
│   │   └── (admin)/      # Admin dashboard
│   ├── components/       # React components
│   │   ├── ui/          # Reusable components
│   │   ├── vehicles/     # Vehicle components
│   │   ├── sections/     # Page sections (Hero, Footer, etc.)
│   │   └── admin/       # Admin components
│   ├── lib/              # Utilities (API, auth, types, utils)
│   └── package.json
│
├── docker-compose.yml   # PostgreSQL container
├── .gitignore
└── README.md
```

## 🛠️ Common Issues & Solutions

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker ps

# Restart PostgreSQL
docker-compose restart postgres

# Test connection
npx prisma db push
```

### Port Already in Use

```bash
# Find process using port 5000 (backend)
lsof -ti:5000
# Kill it
kill -9 <PID>

# Find process using port 3000 (frontend)
lsof -ti:3000
# Kill it
kill -9 <PID>
```

### Frontend Build Error

```bash
cd frontend
rm -rf .next
npm install
npm run dev
```

### Backend Build Error

```bash
cd backend
rm -rf dist
npm install
npm run dev
```

### Database Spelling Issues

If you see incorrect spelling in vehicle data:

```bash
cd backend
npx ts-node scripts/fixSpelling.ts
```

## 🎨 UI Fidelity to Original Demo

The frontend is built to match the original `sample.html` pixel-perfectly:

### ✅ Matches Exactly:
- **Navigation** - Fixed navbar with smooth scroll
- **Hero Section** - Gradient overlay with search form
- **Trust Badges** - Animated badges (500+, All Paperwork, Fair Pricing)
- **Stats Section** - 4 stat cards with hover effects
- **Vehicle Cards** - Exact styling, hover animations
- **Contact Buttons** - WhatsApp, Call, Email, View Details
- **Services Section** - 4 service cards with icons
- **Footer** - Complete footer with links and hours

### ✅ Styling Stack:
- **Bootstrap 5.3.0** - Grid system (row, col-*)
- **Tailwind CSS** - Utility classes
- **Custom CSS** - All original demo styles in `app/globals.css`
- **Font Awesome 6.4.0** - Icons

### 🔧 Key CSS Classes Used:
- `.navbar`, `.navbar-brand`, `.nav-link`
- `.hero-section`, `.hero-title`, `.hero-subtitle`
- `.trust-badge`, `.trust-badges`
- `.search-box`, `.form-control`, `.form-select`
- `.stat-card`, `.stat-number`, `.stat-label`
- `.car-card`, `.car-image`, `.car-body`
- `.contact-btn`, `.btn-primary`, `.btn-outline-primary`
- `.service-card`, `.service-icon`
- `.footer`, `.footer-social`
- `.whatsapp-float`

## 📊 Database Schema

### Tables:

**Users**
- id, email, password (hashed), name, role (ADMIN/STAFF), timestamps

**Vehicles**
- id, make, model, year, priceKES, mileage
- bodyType (SEDAN/SUV/TRUCK/COUPE/HATCHBACK/WAGON)
- fuelType (GASOLINE/DIESEL/HYBRID/ELECTRIC)
- transmission, drivetrain, colors, engine, vin
- status (NEW/USED/CERTIFIED_PRE_OWNED/ON_SALE)
- featured (boolean), description, imageUrl
- timestamps

**Inquiries**
- id, name, email, phone, message
- vehicleId (FK), userId (FK), status
- timestamp

## 📝 API Endpoints

### Authentication
```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
GET    /api/auth/profile     # Get current user (JWT required)
```

### Vehicles
```
GET    /api/vehicles              # Get all vehicles
GET    /api/vehicles/featured    # Get featured vehicles
GET    /api/vehicles/:id          # Get single vehicle
POST   /api/vehicles              # Create vehicle (admin only)
PUT    /api/vehicles/:id          # Update vehicle (admin only)
DELETE /api/vehicles/:id          # Delete vehicle (admin only)
```

### Inquiries
```
POST   /api/inquiries             # Create inquiry
GET    /api/inquiries             # Get all inquiries (admin only)
PATCH  /api/inquiries/:id/status  # Update inquiry status (admin only)
DELETE /api/inquiries/:id          # Delete inquiry (admin only)
```

### Query Parameters (Vehicles)
```
GET /api/vehicles?
    make=toyota&
    bodyType=suv&
    fuelType=gasoline&
    priceMin=3000000&
    priceMax=6000000&
    sortBy=price-low&
    featured=true
```

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run build      # Production build
npm run lint       # Check code quality
npm start          # Run production build
```

### Backend
```bash
cd backend
npm run build      # Compile TypeScript
npm start          # Run production server
```

### Database
```bash
cd backend
npx prisma studio          # Open Prisma Studio (GUI)
npx prisma migrate dev      # Create new migration
npx prisma db push         # Sync schema without migration
npx prisma db seed         # Re-seed database
```

## 🐛 Debugging

### View Backend Logs
```bash
cd backend
npm run dev
# Logs show in terminal
```

### View Frontend Logs
```bash
cd frontend
npm run dev
# Logs show in terminal
```

### Database Debugging
```bash
cd backend
npx prisma studio
# Open browser GUI at http://localhost:5555
```

### VS Code Debugging

1. **Backend**:
   - Set breakpoints in `.ts` files
   - Start server with `npm run dev`
   - Attach debugger (F5) in VS Code

2. **Frontend**:
   - Set breakpoints in `.tsx` files
   - Start server with `npm run dev`
   - Attach debugger (F5) in VS Code
   - Open Chrome DevTools in browser

## 🚢 Production Deployment

### Environment Variables

Create `.env.production` files:

**Backend (.env):**
```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
JWT_SECRET="very-secure-random-string-at-least-32-chars"
PORT=5000
FRONTEND_URL="https://yourdomain.com"
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL="https://api.yourdomain.com/api"
```

### Build Commands

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

### Deployment Options

- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: Railway, Render, AWS EC2, DigitalOcean
- **Database**: Supabase, Neon, AWS RDS, ElephantSQL

## 📖 VS Code Extensions Recommended

- **ES7+ ESLint** - TypeScript linting
- **Prettier** - Code formatting
- **Prisma** - Database integration
- **Tailwind CSS IntelliSense** - Tailwind autocompletion
- **Error Lens** - Better error display
- **Auto Rename Tag** - Rename tag pairs

## 🎯 Development Workflow

### Daily Development

1. **Start Services**:
   ```bash
   docker-compose up -d
   cd backend && npm run dev
   cd frontend && npm run dev  # New terminal
   ```

2. **Make Changes**:
   - Edit files in VS Code
   - Changes auto-reload

3. **Test**:
   - Visit http://localhost:3001
   - Test functionality
   - Check browser console for errors

4. **Debug**:
   - Check backend/frontend logs
   - Use Prisma Studio for database inspection
   - Use browser DevTools for frontend debugging

### Before Committing

```bash
# Run tests (if you add them)
npm test

# Run linters
npm run lint

# Build to check for errors
npm run build
```

## 💡 Tips for VS Code Development

### 1. Useful Keyboard Shortcuts

- **Ctrl+P** - Quick open file
- **Ctrl+Shift+F** - Find in files
- **Ctrl+F** - Find in current file
- **F12** - Open DevTools
- **Ctrl+`** - Toggle terminal
- **Ctrl+B** - Toggle sidebar

### 2. Split Screen

```bash
# View > Editor Layout > Split Up/Down/Right/Left
# Great for viewing frontend and backend side by side
```

### 3. Integrated Terminal

```bash
# View > Terminal
# Use integrated terminal for git commands
```

### 4. Git Integration

```bash
# Source Control panel (left sidebar)
# Commit, push, pull directly from VS Code
```

## 🔄 Reset Database

If you need to reset everything:

```bash
cd backend

# Stop any running services
pkill -f "npm run dev"

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Re-seed database
npx prisma db seed

# Start backend again
npm run dev
```

## 📚 Additional Resources

### Documentation
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Express**: https://expressjs.com
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs

### Troubleshooting
- **Stack Overflow**: https://stackoverflow.com
- **Next.js GitHub**: https://github.com/vercel/next.js/issues
- **Prisma Discord**: https://discord.gg/prisma

## 🎉 You're Ready!

Once you have everything running:

1. **Visit Frontend**: http://localhost:3001
2. **Login to Admin**: http://localhost:3001/auth/login
3. **Browse Vehicles**: http://localhost:3001/inventory
4. **Check API**: http://localhost:5000/health

---

**Happy Coding! 🚀**
