# 💻 TRUSTAUTO KENYA - DEVELOPMENT GUIDE

**Last Updated:** 2026-01-16
**Purpose:** Complete guide for local development, setup, and deployment

---

## 📋 TABLE OF CONTENTS

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [VS Code Setup](#vs-code-setup)
- [Testing](#testing)
- [Production Build](#production-build)

---

## 📦 PREREQUISITES

### Required Software

- **Node.js 18+** - JavaScript runtime
- **Docker** - For PostgreSQL container
- **Git** - Version control
- **VS Code** (recommended) - Code editor

### Verify Installation

```bash
# Check Node.js version (must be 18+)
node --version

# Check Docker is installed
docker --version

# Check Git is installed
git --version
```

---

## 🚀 LOCAL DEVELOPMENT SETUP

### Option 1: Git Clone

```bash
# Clone repository
git clone <repository-url>
cd demo-car-yard
```

### Option 2: Manual Setup

If copying files manually, ensure all files are in correct directory structure (see [Project Structure](#project-structure)).

---

## 🔧 STEP-BY-STEP SETUP

### Step 1: Start PostgreSQL (Docker)

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify it's running
docker ps

# View logs (if needed)
docker-compose logs -f postgres
```

**What this does:**
- Starts PostgreSQL 15+ in a Docker container
- Maps port 5432 to localhost
- Creates database named "trustauto"
- Sets default user: `postgres` / `password`

---

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies (if needed)
npm install

# Copy environment template
cp .env.example .env

# Edit .env file
nano .env  # Or use VS Code
```

**Required .env values (defaults work for local):**
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/trustauto"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-secret-here"
```

---

### Step 3: Run Database Migrations

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (recommended)
npx prisma db seed
```

**What seeding does:**
- Creates admin user: `admin@trustauto.co.ke` / `Admin123!`
- Adds 24 demo vehicles with KSh prices
- Populates initial database state

---

### Step 4: Start Backend Server

```bash
cd backend

# Start development server
npm run dev
```

**Backend will run at:** http://localhost:5000

**Verify it's running:**
```bash
curl http://localhost:5000/health
# Expected: {"success":true,"status":"ok",...}
```

---

### Step 5: Setup Frontend (New Terminal)

```bash
# Open new terminal
cd frontend

# Install dependencies (if needed)
npm install

# Create local environment file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev
```

**Frontend will run at:** http://localhost:3000 (or 3001 if 3000 is in use)

---

### Step 6: Verify Setup

**Open browser and test:**

1. **Frontend Homepage:** http://localhost:3000
2. **Admin Login:** http://localhost:3000/auth/login
   - Email: `admin@trustauto.co.ke`
   - Password: `Admin123!`
3. **Backend Health:** http://localhost:5000/health
4. **Database GUI:** Run `cd backend && npx prisma studio`

---

## 📁 PROJECT STRUCTURE

```
demo-car-yard/
├── backend/                    # Express API (Node.js + TypeScript + Prisma)
│   ├── src/
│   │   ├── config/            # Database, multer configuration
│   │   ├── controllers/        # API request handlers
│   │   ├── middleware/         # Auth, validation, error handling
│   │   ├── routes/            # API endpoint definitions
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript extensions
│   │   └── utils/             # Helper functions
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.ts            # Demo data (24 vehicles)
│   │   └── migrations/        # Database migrations
│   ├── scripts/               # Utility scripts
│   ├── uploads/               # Image uploads
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js 16 App Router
│   ├── app/
│   │   ├── (marketing)/      # Public pages
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── inventory/
│   │   │   │   └── page.tsx  # Vehicle listing
│   │   │   ├── services/
│   │   │   ├── contact/
│   │   │   └── vehicles/[slug]/
│   │   ├── (auth)/           # Login/Register
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (admin)/          # Admin dashboard
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── vehicles/page.tsx
│   │   │   ├── vehicles/new/page.tsx
│   │   │   ├── vehicles/[id]/page.tsx
│   │   │   └── inquiries/page.tsx
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Complete styles
│   ├── components/
│   │   ├── ui/               # Reusable components
│   │   ├── vehicles/          # Vehicle components
│   │   ├── sections/          # Page sections
│   │   └── admin/            # Admin components
│   ├── lib/                   # Utilities
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── package.json
│   └── next.config.js
│
├── docker-compose.yml          # PostgreSQL container
├── .gitignore                # Git ignore rules
├── .env.example              # Environment template
├── README.md                 # Project overview
├── PROJECT_STATE.md          # Persistent project memory
├── DEVELOPMENT.md            # This file
├── SECURITY.md               # Security fixes guide
├── TROUBLESHOOTING.md       # Common issues
└── PROJECT_DOCS.md          # Complete documentation
```

---

## 🔄 DEVELOPMENT WORKFLOW

### Daily Development Process

#### 1. Start All Services (3 terminals)

**Terminal 1 - Database:**
```bash
docker-compose up -d
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

#### 2. Make Changes

- Edit files in VS Code
- Backend auto-restarts with ts-node-dev
- Frontend hot-reloads with Next.js

#### 3. Test Changes

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **API:** Test with curl or Postman
- **Database:** `cd backend && npx prisma studio`

#### 4. Debug Issues

- Check terminal logs
- Check browser DevTools (F12)
- Use Prisma Studio for database inspection

---

### Before Committing

```bash
# 1. Check status
git status

# 2. Run tests (if added)
npm test

# 3. Run linters
cd backend && npm run lint
cd frontend && npm run lint

# 4. Build to check for errors
cd backend && npm run build
cd frontend && npm run build

# 5. Stage and commit
git add .
git commit -m "Your commit message"
```

---

### Database Operations

#### Reset Database (WARNING: deletes all data)
```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

#### Create New Migration
```bash
cd backend
npx prisma migrate dev --name your-migration-name
```

#### View Database with GUI
```bash
cd backend
npx prisma studio
# Opens at http://localhost:5555
```

#### Sync Schema Without Migration
```bash
cd backend
npx prisma db push
```

---

## 🎨 VS CODE SETUP

### Recommended Extensions

Install these extensions for best development experience:

1. **Prisma** - `Prisma.prisma`
   - Database integration and autocomplete

2. **ESLint** - `dbaeumer.vscode-eslint`
   - Code linting support

3. **Prettier** - `esbenpetersen.prettier-vscode`
   - Code formatting

4. **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`
   - Tailwind autocompletion

5. **TypeScript Importer** - `pmneo.tsimporter`
   - Auto import TypeScript modules

6. **Error Lens** - `usernamehw.errorlens`
   - Better error display

7. **GitLens** - `eamodio.gitlens`
   - Enhanced Git capabilities

8. **Thunder Client** - `vscode-thunder-client`
   - API testing

---

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenpetersen.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "prisma.prismaFmt": true,
  "files.exclude": {
    "**/.next": true,
    "**/node_modules": true,
    "**/dist": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["className=\"([^\"]*)\"", "([^\"]*)"]
  ]
}
```

---

### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: Frontend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/frontend/package.json",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Express: Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/server.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal"
    }
  ]
}
```

---

### Useful VS Code Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+P` | Quick Open file |
| `Ctrl+Shift+F` | Find in files |
| `Ctrl+G` | Go to line |
| `F12` | Go to definition |
| `Ctrl+D` | Add selection to next match |
| `Ctrl+`` ` | Toggle terminal |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+Shift+E` | Focus explorer |
| `Alt+Up/Down` | Move line up/down |
| `F2` | Rename symbol |

---

## 🧪 TESTING

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Build for production
npm run build

# Start production build
npm start

# Run linter
npm run lint
```

---

### Backend Tests

```bash
cd backend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

### Manual API Testing

#### Using curl

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@trustauto.co.ke","password":"Admin123!"}'

# Get vehicles
curl http://localhost:5000/api/vehicles

# Get single vehicle
curl http://localhost:5000/api/vehicles/<id>

# Create vehicle (with auth)
curl -X POST http://localhost:5000/api/vehicles \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"make":"Toyota","model":"Camry","year":2025,"priceKES":5000000,...}'
```

---

#### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create request collection
3. Set base URL: `http://localhost:5000/api`
4. Save auth token as environment variable
5. Test all endpoints

---

## 🚀 PRODUCTION BUILD

### Backend Production Build

```bash
cd backend

# Compile TypeScript
npm run build

# Start production server
npm start

# Or use PM2 for process management
pm2 start dist/server.js --name "trustauto-backend"
```

---

### Frontend Production Build

```bash
cd frontend

# Build for production
npm run build

# Start production server
npm start

# Or use PM2
pm2 start npm --name "trustauto-frontend" -- start
```

---

### Environment Variables for Production

#### Backend (.env.production)

```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:password@host:5432/trustauto"
JWT_SECRET="<very-secure-random-string-at-least-32-chars>"
JWT_EXPIRES_IN="7d"
PORT=5000
FRONTEND_URL="https://yourdomain.com"

# Cloudinary (ROTATED CREDENTIALS!)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-rotated-secret"
```

#### Frontend (.env.production)

```env
NEXT_PUBLIC_API_URL="https://api.yourdomain.com/api"
```

---

## 📦 DEPENDENCIES MANAGEMENT

### Add New Backend Dependency

```bash
cd backend

# Install package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Install with TypeScript types
npm install package-name
npm install --save-dev @types/package-name
```

---

### Add New Frontend Dependency

```bash
cd frontend

# Install package
npm install package-name
```

---

### Update Dependencies

```bash
# Update all (not recommended in production)
cd backend && npm update
cd frontend && npm update

# Update specific package
npm update package-name

# Check for outdated packages
npm outdated
```

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Port Already in Use

```bash
# Find process on port 5000
lsof -ti:5000

# Kill it
kill -9 <PID>

# Find process on port 3000
lsof -ti:3000

# Kill it
kill -9 <PID>
```

---

### Database Connection Error

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker-compose restart postgres

# Test connection
cd backend
npx prisma db push
```

---

### Frontend Build Errors

```bash
cd frontend

# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

---

### Backend Build Errors

```bash
cd backend

# Clear cache and reinstall
rm -rf dist node_modules
npm install
npm run dev
```

---

### Module Not Found Errors

```bash
cd backend  # or frontend

# Reinstall dependencies
npm install

# Clear Node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 DEVELOPMENT BEST PRACTICES

### Code Style

#### TypeScript

- Always type function parameters
- Use interfaces for objects
- Avoid `any` type
- Use `readonly` for arrays that shouldn't be modified

#### React/Next.js

- Use functional components
- Use hooks for state management
- Keep components small and focused
- Use proper error boundaries

#### Naming Conventions

- **Files:** PascalCase for components, camelCase for utilities
- **Components:** PascalCase (VehicleCard.tsx)
- **Functions:** camelCase (fetchVehicles)
- **Constants:** UPPER_SNAKE_CASE (API_URL)
- **Interfaces:** PascalCase (Vehicle)

---

### Git Workflow

#### Branch Strategy

```
main (production)
  ↑
develop (staging)
  ↑
feature/branch-name (development)
```

#### Commit Message Format

```
type(scope): subject

Examples:
feat(vehicles): add vehicle filtering by price
fix(auth): resolve login token expiry issue
docs(readme): update setup instructions
style(ui): improve button hover effects
```

---

### Environment Safety

- ✅ Never commit `.env` files
- ✅ Use `.env.example` as template
- ✅ Rotate secrets regularly
- ✅ Use different secrets for dev/staging/production
- ✅ Document required environment variables

---

## 📞 SUPPORT

### Documentation

- **README.md** - Project overview
- **PROJECT_STATE.md** - Persistent project memory
- **PROJECT_DOCS.md** - Complete documentation
- **TROUBLESHOOTING.md** - Common issues
- **SECURITY.md** - Security fixes

### External Resources

- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **Express:** https://expressjs.com
- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs

### Community Support

- **Stack Overflow:** https://stackoverflow.com
- **Next.js GitHub:** https://github.com/vercel/next.js/issues
- **Prisma Discord:** https://discord.gg/prisma

---

**Last Updated:** 2026-01-16
**Version:** 1.0.0

---

🚀 **Happy Coding!**
