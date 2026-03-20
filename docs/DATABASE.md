# Database Schema & Connections

## Connection Setup
- Provider: SQLite (development)
- ORM: Prisma
- Schema location: backend/prisma/schema.prisma
- Migrations: backend/prisma/migrations/

## Models

### Vehicle
Purpose: Represents a car listing on the public site

| Field        | Type     | Required | Notes                        |
|--------------|----------|----------|------------------------------|
| id           | String   | Yes      | uuid() primary key           |
| slug         | String   | Yes      | @unique — URL identifier     |
| make         | String   | Yes      | e.g. "Toyota"                |
| model        | String   | Yes      | e.g. "Prado"                 |
| year         | Int      | Yes      | Manufacturing year           |
| priceKES     | Int      | Yes      | Price in Kenyan Shillings    |
| mileage      | Int      | Yes      | Kilometers driven            |
| bodyType     | String   | Yes      | SUV, Saloon, etc.            |
| fuelType     | String   | Yes      | Petrol, Diesel, Hybrid       |
| transmission | String   | Yes      | Automatic, Manual            |
| drivetrain   | String   | No       | AWD, FWD, RWD                |
| exteriorColor| String   | No       | Paint color                  |
| interiorColor| String   | No       | Interior color               |
| engine       | String   | No       | Engine specs                 |
| vin          | String   | No       | Vehicle ID number            |
| location     | String   | No       | Physical location            |
| status       | String   | Yes      | AVAILABLE/RESERVED/SOLD      |
| featured     | Boolean  | Yes      | Show on homepage             |
| description  | String   | No       | Full description             |
| imageUrl     | String   | No       | Main image URL               |
| images       | String   | No       | JSON array of image URLs     |
| imagePublicIds| String  | No       | JSON array of Cloudinary IDs |
| viewCount    | Int      | Yes      | ⚠️ NOT "views" — was a bug   |
| isDraft      | Boolean  | Yes      | Draft status                 |
| deletedAt    | DateTime | No       | Soft delete timestamp        |
| createdAt    | DateTime | Yes      | Creation timestamp           |
| updatedAt    | DateTime | Yes      | Update timestamp             |

Relations:
- images → VehicleImage[] (one-to-many)
- inquiries → Inquiry[]
- softInterests → SoftInterest[]
- reservations → Reservation[]

### User
Purpose: Admin accounts only (no public registration)

| Field    | Type   | Notes                           |
|----------|--------|---------------------------------|
| id       | String | uuid()                          |
| email    | String | @unique                         |
| password | String | bcrypt hashed — NEVER returned  |
| name     | String | Display name                    |
| role     | String | ADMIN only currently            |

### Inquiry
Purpose: Customer enquiries on vehicles

| Field      | Type     | Notes                    |
|------------|----------|--------------------------|
| id         | String   | uuid()                   |
| name       | String   | Customer name            |
| email      | String   | Customer email           |
| phone      | String   | Customer phone           |
| message    | String   | Enquiry text             |
| vehicleId  | String   | Foreign key to Vehicle   |
| status     | String   | NEW/READ/REPLIED/CLOSED  |
| createdAt  | DateTime | Timestamp                |

### Settings
Purpose: Key-value store for app configuration

| Field | Type   | Notes              |
|-------|--------|--------------------|
| id    | String | uuid()             |
| key   | String | @unique            |
| value | String | JSON or plain text |

### SoftInterest
Purpose: "Soft" leads — customers who expressed interest

| Field       | Type     | Notes                    |
|-------------|----------|--------------------------|
| id          | String   | uuid()                   |
| name        | String   | Customer name            |
| phone       | String   | Customer phone           |
| vehicleId   | String   | Foreign key to Vehicle   |
| followedUp  | Boolean  | Has admin followed up    |
| createdAt   | DateTime | Timestamp                |

### NotifySubscriber
Purpose: "Notify me" subscribers for new inventory

| Field         | Type     | Notes              |
|---------------|----------|--------------------|
| id            | String   | uuid()             |
| name          | String   | Subscriber name    |
| phone         | String   | Subscriber phone   |
| maxBudget     | Int      | Budget limit       |
| intentMake    | String   | Preferred make     |
| intentModel   | String   | Preferred model    |
| status        | String   | ACTIVE/INACTIVE    |

### Reservation
Purpose: Vehicle reservations with M-Pesa

| Field            | Type     | Notes                    |
|------------------|----------|--------------------------|
| id               | String   | uuid()                   |
| vehicleId        | String   | Foreign key to Vehicle   |
| buyerName        | String   | Buyer name               |
| buyerPhone       | String   | Buyer phone              |
| amount           | Int      | Reservation amount       |
| checkoutRequestId| String   | M-Pesa checkout ID       |
| mpesaReceipt     | String   | M-Pesa receipt number    |
| status           | String   | PENDING/ACTIVE/EXPIRED   |
| expiresAt        | DateTime | Reservation expiry       |

### CarMake / CarModel
Purpose: Reference data for makes/models

| Field        | Type     | Notes              |
|--------------|----------|--------------------|
| id           | String   | uuid()             |
| name         | String   | Make/Model name    |
| key          | String   | URL-safe key       |
| logoUrl      | String   | Brand logo (makes) |

## Key Relationships
```
Vehicle ──< VehicleImage    (one-to-many)
Vehicle ──< Inquiry         (one-to-many)
Vehicle ──< SoftInterest    (one-to-many)
Vehicle ──< Reservation     (one-to-many)
CarMake  ──< CarModel       (one-to-many)
```

## Seeded Data
Admin user: admin@trustauto.co.ke
Seed file: backend/prisma/seed.ts
Run: npx prisma db seed

## Common Queries

Public vehicle list:
```typescript
prisma.vehicle.findMany({
  where: { status: 'AVAILABLE', isDraft: false },
  orderBy: { createdAt: 'desc' },
  select: { id: true, slug: true, make: true, model: true, ... }
})
```

View count increment:
```typescript
prisma.vehicle.update({
  where: { id },
  data: { viewCount: { increment: 1 } }  // ← viewCount not views
})
```

Settings read:
```typescript
prisma.settings.findUnique({ where: { key: 'dealerPhone' } })
```
