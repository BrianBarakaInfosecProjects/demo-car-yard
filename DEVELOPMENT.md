# Local Development Guide for VS Code

This guide helps you set up TrustAuto Kenya for local development after cloning from Git.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 15+ or Docker
- Git
- VS Code (or any code editor)

### 1. Clone Repository

```bash
git clone <repository-url>
cd demo-car-yard
```

### 2. Start PostgreSQL (Docker)

```bash
docker-compose up -d
```

This starts PostgreSQL on port 5432.

### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file if needed (defaults work for local development):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/trustauto"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### 4. Run Database Migrations

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### 5. Seed Database (Optional but Recommended)

```bash
cd backend
npx prisma db seed
```

This creates:
- Admin user: `admin@trustauto.co.ke` / `Admin123!`
- 24 demo vehicles with KSh prices

### 6. Start Backend Server

```bash
cd backend
npm run dev
```

Backend runs at http://localhost:5000

### 7. Start Frontend Server (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:3000

## 🎯 Project Structure

```
demo-car-yard/
├── backend/              # Express API
│   ├── src/            # Source code
│   │   ├── config/      # DB & upload config
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth, validation
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── utils/       # Helpers
│   ├── prisma/         # Schema & migrations
│   ├── uploads/         # Image uploads
│   └── package.json
│
├── frontend/            # Next.js App
│   ├── app/            # App Router pages
│   ├── components/     # React components
│   ├── lib/            # Utilities
│   └── package.json
│
├── docker-compose.yml   # PostgreSQL
├── .env.example        # Env template
└── .gitignore         # Git ignore rules
```

## 🔐 Default Admin Credentials

```
Email:    admin@trustauto.co.ke
Password:  Admin123!
```

To change password, edit `backend/prisma/seed.ts` and run `npx prisma db seed`.

## 🛠️ Common Tasks

### Reset Database

```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

### View Database with GUI

```bash
cd backend
npx prisma studio
```

Opens at http://localhost:5555

### Create New Migration

```bash
cd backend
npx prisma migrate dev --name your-migration-name
```

### Stop All Services

```bash
# Stop Docker
docker-compose down

# Stop processes
pkill -f "next dev"
pkill -f "ts-node-dev"
```

### Restart All Services

```bash
# Start database
docker-compose up -d

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev
```

## 📝 VS Code Extensions (Recommended)

1. **Prisma** - Prisma ORM support
2. **ESLint** - Linting support
3. **Prettier** - Code formatting
4. **Tailwind CSS IntelliSense** - Tailwind autocompletion
5. **TypeScript Importer** - Auto import TypeScript

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change ports in .env files
```

### Database Connection Error

```bash
# Check PostgreSQL is running
docker ps

# Restart PostgreSQL
docker-compose restart postgres

# Test connection
cd backend
npx prisma db push
```

### Frontend Build Errors

```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Backend Build Errors

```bash
cd backend
rm -rf dist node_modules
npm install
npm run dev
```

### Module Not Found

```bash
cd backend  # or frontend
npm install  # Reinstall dependencies
```

## 📊 Development Workflow

### Typical Development Day

1. Start all services:
   ```bash
   docker-compose up -d
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

2. Make changes to code
3. Hot reload will automatically refresh browser
4. For backend changes, check logs:
   ```bash
   tail -f backend/logs/output.log
   ```

### Testing Changes

1. Frontend: Open http://localhost:3000
2. Backend: Test API with Postman or curl:
   ```bash
   curl http://localhost:5000/health
   curl http://localhost:5000/api/vehicles
   ```

### Debugging

#### Frontend Debugging
1. Open DevTools (F12)
2. Check Console tab for errors
3. Use React DevTools component inspector

#### Backend Debugging
1. Use `console.log` in controllers/services
2. Check terminal output for logs
3. Use VS Code debugger:
   - Set breakpoints in code
   - Press F5 to start debugging
   - Select "Node.js: Nodemon" configuration

## 📝 Code Style

### TypeScript
- Always type function parameters
- Use interfaces for objects
- Avoid `any` type
- Use `readonly` for arrays that shouldn't be modified

### React/Next.js
- Use functional components
- Use hooks for state management
- Keep components small and focused
- Use proper error boundaries

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Components**: PascalCase (VehicleCard.tsx)
- **Functions**: camelCase (fetchVehicles)
- **Constants**: UPPER_SNAKE_CASE (API_URL)

## 🚀 Production Build

### Frontend

```bash
cd frontend
npm run build
npm start
```

### Backend

```bash
cd backend
npm run build
npm start
```

## 📦 Dependencies Management

### Add New Backend Dependency

```bash
cd backend
npm install package-name
npm install --save-dev @types/package-name  # For TypeScript
```

### Add New Frontend Dependency

```bash
cd frontend
npm install package-name
```

### Update Dependencies

```bash
# Update all (not recommended in production)
cd backend && npm update
cd frontend && npm update

# Update specific package
npm update package-name
```

## 🐙 VS Code Settings (Optional)

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "prisma.prismaFmt": true
}
```

## 📚 Useful Commands Reference

```bash
# Backend
cd backend
npm run dev              # Start dev server
npm run build            # Build for production
npm start               # Run production build
npx prisma studio        # Open Prisma Studio
npx prisma db seed      # Seed database

# Frontend
cd frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm start               # Run production build
npm run lint             # Run linter

# Database
docker-compose up -d      # Start PostgreSQL
docker-compose down       # Stop PostgreSQL
docker-compose logs -f    # View database logs
```

## 🎨 UI Notes

The frontend uses:
- **Bootstrap 5.3** for grid and basic styling
- **Tailwind CSS** for utility classes
- **Custom CSS** in `globals.css` for theme variables

To match the original demo UI:
- Bootstrap grid system (`row`, `col-lg-6`, etc.)
- Bootstrap spacing classes (`mb-4`, `py-5`, etc.)
- Bootstrap buttons (`btn-primary`, `btn-outline-primary`)
- Custom CSS for theme consistency

## 💡 Tips

1. Use VS Code's integrated terminal for all commands
2. Keep one terminal for backend, one for frontend
3. Use `git status` often to check changes
4. Commit frequently with descriptive messages
5. Run tests before pushing changes
6. Use `npx prisma format` to format schema

## 🆘 Getting Help

1. Check this guide for common solutions
2. Review error messages carefully
3. Check console/terminal logs
4. Review Prisma Studio for database issues
5. Contact team for persistent issues

---

**Happy Coding! 🚀**
