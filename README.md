# TrustAuto Kenya 🚗

A modern, full-stack vehicle inventory management platform for Kenya's car yard industry. Built with Next.js, Express, PostgreSQL, and Cloudinary.

## ✨ Features

### For Customers
- **Vehicle Inventory** - Browse 500+ vehicles with advanced filtering (make, body type, fuel type, price range)
- **Smart Search** - Autocomplete search and smart sorting (price, year, brand)
- **Vehicle Details** - Comprehensive vehicle information with multiple images and specifications
- **Inquiries** - Submit inquiries directly from vehicle listings
- **WhatsApp Integration** - Quick contact via WhatsApp

### For Admins
- **Dashboard Analytics** - Real-time insights on inventory and inquiries
- **Vehicle Management** - Full CRUD operations with bulk actions
- **Image Management** - Cloudinary integration for image hosting and optimization
- **Inquiry Management** - Track and respond to customer inquiries
- **Audit Logging** - Complete audit trail of all administrative actions
- **User Roles** - Admin and staff role-based access control
- **Activity Logs** - Session tracking and user activity monitoring

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14.2.x with App Router
- **UI Library:** React 18.2.x
- **Styling:** Tailwind CSS + Bootstrap 5.3
- **Forms:** React Hook Form with Zod validation
- **Icons:** Lucide React + FontAwesome
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 4.18.2
- **Language:** TypeScript 5.3
- **Database ORM:** Prisma 5.7
- **Authentication:** JWT (jsonwebtoken)
- **File Upload:** Multer with Cloudinary integration
- **Validation:** Zod + express-validator
- **Security:** Helmet, bcryptjs, rate limiting
- **API Documentation:** See [API_DOCS.md](docs/API_DOCS.md)

### Database & Infrastructure
- **Database:** PostgreSQL 15+
- **Containerization:** Docker & Docker Compose
- **Image Hosting:** Cloudinary
- **Package Manager:** npm

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm or yarn
- Cloudinary account (for image hosting)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/BrianBarakaInfosecProjects/demo-car-yard.git
cd demo-car-yard
```

2. **Setup environment variables:**
```bash
cp .env.example .env.local
```

3. **Configure .env.local with:**
```
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/trustauto
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_jwt_secret_key

# Admin
ADMIN_PASSWORD_HASH=generated_hash
```

4. **Start services with Docker Compose:**
```bash
docker-compose up -d
```

5. **Install dependencies and run migrations:**
```bash
# Backend
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate

# Frontend (in new terminal)
cd frontend
npm install
```

6. **Start development servers:**
```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm run dev
```

Visit `http://localhost:3000` for the frontend and `http://localhost:5000` for the API.

## 📁 Project Structure

```
demo-car-yard/
├── backend/
│   ├── src/
│   │   ├── app.ts                 # Express app setup
│   │   ├── server.ts              # Server entry point
│   │   ├── config/                # Configuration files
│   │   ├── controllers/           # Request handlers
│   │   ├── middleware/            # Express middleware
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logic
│   │   ├── types/                 # TypeScript types
│   │   └── utils/                 # Utility functions
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   ├── migrations/            # DB migrations
│   │   └── seed.ts                # Seed data
│   └── package.json
├── frontend/
│   ├── app/                       # Next.js App Router pages
│   ├── components/                # React components
│   ├── lib/                       # Utilities and types
│   ├── public/                    # Static assets
│   └── package.json
├── docs/                          # Documentation
└── docker-compose.yml             # Container orchestration
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Helmet** - HTTP header security
- **CORS Protection** - Configurable cross-origin policy
- **Rate Limiting** - DDoS protection with express-rate-limit
- **Input Validation** - Zod schema validation on all endpoints
- **Password Hashing** - bcryptjs for secure password storage
- **Audit Logging** - Complete audit trail of admin actions
- **XSS Prevention** - Input sanitization and output encoding

## 🗄 Database Schema

### Core Models
- **User** - Admin/staff users with roles
- **Vehicle** - Car inventory with metadata and images
- **Inquiry** - Customer inquiries for vehicles
- **AuditLog** - Audit trail of admin actions
- **SessionLog** - User session and login tracking
- **Notification** - System notifications

See [backend/prisma/schema.prisma](backend/prisma/schema.prisma) for complete schema.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Login and receive JWT token

### Vehicles
- `GET /api/vehicles` - List all vehicles (public)
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create vehicle (admin only)
- `PUT /api/vehicles/:id` - Update vehicle (admin only)
- `DELETE /api/vehicles/:id` - Delete vehicle (admin only)

### Inquiries
- `GET /api/inquiries` - List inquiries (admin only)
- `POST /api/inquiries` - Submit inquiry (public)
- `PUT /api/inquiries/:id` - Update inquiry status (admin only)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics

### Audit Logs
- `GET /api/logs/audit` - View audit logs (admin only)

See [docs/API_DOCS.md](docs/API_DOCS.md) for complete API documentation.

## 🧪 Testing

### Run tests:
```bash
cd backend
npm test

cd ../frontend
npm test
```

## 📝 Environment Configuration

See [.env.example](.env.example) for all available environment variables.

### Key Variables
- `NODE_ENV` - development, production
- `DATABASE_URL` - PostgreSQL connection string
- `CLOUDINARY_*` - Image hosting credentials
- `JWT_SECRET` - Token signing secret
- `ADMIN_PASSWORD_HASH` - Default admin password hash

## 📚 Documentation

- [DEVELOPMENT.md](docs/DEVELOPMENT.md) - Development guidelines
- [SECURITY.md](docs/SECURITY.md) - Security considerations
- [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - Common issues and solutions
- [PROJECT_STATE.md](docs/PROJECT_STATE.md) - Project status and history

## 🐛 Known Issues

See [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md) for documented issues and workarounds.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is proprietary. All rights reserved.

## 👥 Support

For issues and questions:
- WhatsApp: [+254722000000](https://wa.me/254722000000)
- Email: support@trustauto.co.ke

---

**Last Updated:** January 16, 2026  
**Version:** 1.0.0  
**Status:** Production Ready
