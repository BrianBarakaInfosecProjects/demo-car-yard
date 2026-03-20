# API Endpoints Reference

Base URL (local):      http://localhost:5000/api
Base URL (production): https://[railway-url].railway.app/api

## Authentication
All protected routes require:
```
Header: Authorization: Bearer <jwt_token>
```
Token obtained from: POST /api/auth/login

## Endpoints

### Auth
| Method | Route            | Auth | Description          |
|--------|------------------|------|----------------------|
| POST   | /auth/login      | No   | Returns JWT token    |
| GET    | /auth/profile    | Yes  | Get current user     |
| PUT    | /auth/profile    | Yes  | Update profile       |
| POST   | /auth/logout     | Yes  | Logout (session log) |

### Vehicles
| Method | Route                        | Auth  | Role  | Description        |
|--------|------------------------------|-------|-------|--------------------|
| GET    | /vehicles                    | No    | -     | Paginated list     |
| GET    | /vehicles/featured           | No    | -     | 6 featured cars    |
| GET    | /vehicles/slug/:slug         | No    | -     | Single vehicle     |
| GET    | /vehicles/similar/:id        | No    | -     | Similar vehicles   |
| GET    | /vehicles/suggestions        | No    | -     | Search suggestions |
| POST   | /vehicles/:id/view           | No    | -     | Increment viewCount|
| POST   | /vehicles                    | Yes   | ADMIN | Create vehicle     |
| PUT    | /vehicles/:id                | Yes   | ADMIN | Update vehicle     |
| DELETE | /vehicles/:id                | Yes   | ADMIN | Soft delete        |
| PATCH  | /vehicles/:id/status         | Yes   | ADMIN | Change status      |
| GET    | /vehicles/admin              | Yes   | ADMIN | All vehicles (inc drafts) |
| GET    | /vehicles/admin/featured     | Yes   | ADMIN | Admin featured list |

### Inquiries
| Method | Route              | Auth  | Role  | Description        |
|--------|--------------------|-------|-------|-------------------|
| GET    | /inquiries         | Yes   | ADMIN | List all          |
| GET    | /inquiries/:id     | Yes   | ADMIN | Single inquiry    |
| POST   | /inquiries         | No    | -     | Create inquiry    |
| PATCH  | /inquiries/:id     | Yes   | ADMIN | Update status     |
| DELETE | /inquiries/:id     | Yes   | ADMIN | Delete            |

### Analytics
| Method | Route                    | Auth  | Role  | Description        |
|--------|--------------------------|-------|-------|-------------------|
| GET    | /analytics/dashboard     | Yes   | ADMIN | Dashboard stats   |
| GET    | /analytics/popular       | Yes   | ADMIN | Popular vehicles  |
| GET    | /analytics/activity      | Yes   | ADMIN | Recent activity   |

### Settings
| Method | Route                | Auth  | Role  | Description        |
|--------|----------------------|-------|-------|-------------------|
| GET    | /settings            | Yes   | ADMIN | All settings      |
| GET    | /settings/public     | No    | -     | Public settings   |
| GET    | /settings/:key       | Yes   | ADMIN | Get by key        |
| PUT    | /settings/:key       | Yes   | ADMIN | Update setting    |

### Notifications
| Method | Route                  | Auth  | Role  | Description        |
|--------|------------------------|-------|-------|-------------------|
| GET    | /notifications         | Yes   | ADMIN | List notifications|
| GET    | /notifications/unread  | Yes   | ADMIN | Unread count      |
| PATCH  | /notifications/:id/read| Yes   | ADMIN | Mark as read      |
| PATCH  | /notifications/read-all| Yes   | ADMIN | Mark all read     |

### Bulk Operations
| Method | Route                      | Auth  | Role  | Description        |
|--------|----------------------------|-------|-------|-------------------|
| DELETE | /bulk/vehicles             | Yes   | ADMIN | Bulk delete       |
| PATCH  | /bulk/vehicles/status      | Yes   | ADMIN | Bulk status       |
| PATCH  | /bulk/vehicles/featured    | Yes   | ADMIN | Bulk featured     |
| PATCH  | /bulk/vehicles/location    | Yes   | ADMIN | Bulk location     |
| PATCH  | /bulk/vehicles/publish     | Yes   | ADMIN | Bulk publish      |
| PATCH  | /bulk/vehicles/unpublish   | Yes   | ADMIN | Bulk unpublish    |

### Users
| Method | Route                  | Auth  | Role  | Description        |
|--------|------------------------|-------|-------|-------------------|
| GET    | /users                 | Yes   | ADMIN | List users        |
| GET    | /users/:id             | Yes   | ADMIN | Get user          |
| POST   | /users                 | Yes   | ADMIN | Create user       |
| PUT    | /users/:id             | Yes   | ADMIN | Update user       |
| DELETE | /users/:id             | Yes   | ADMIN | Delete user       |
| POST   | /users/:id/reset-password| Yes | ADMIN | Reset password    |

### M-Pesa / Reservations
| Method | Route                  | Auth  | Role  | Description        |
|--------|------------------------|-------|-------|-------------------|
| POST   | /mpesa/stk-push        | No    | -     | Initiate payment  |
| POST   | /mpesa/callback        | No    | -     | M-Pesa callback   |
| GET    | /reservations          | Yes   | ADMIN | List reservations |
| GET    | /reservations/expiring | Yes   | ADMIN | Expiring soon     |
| PATCH  | /reservations/:id/confirm| Yes | ADMIN | Confirm reservation|
| PATCH  | /reservations/:id/expire| Yes  | ADMIN | Expire reservation|

### Car Reference
| Method | Route                      | Auth  | Description        |
|--------|----------------------------|-------|-------------------|
| GET    | /car-reference/makes       | No    | List all makes    |
| GET    | /car-reference/makes/:makeId/models| No | Models for make |
| GET    | /car-reference/models/:modelId| No  | Single model      |

### Soft Interests
| Method | Route                        | Auth  | Role  | Description        |
|--------|------------------------------|-------|-------|-------------------|
| GET    | /soft-interests              | Yes   | ADMIN | List all          |
| GET    | /soft-interests/pending      | Yes   | ADMIN | Pending followups |
| POST   | /soft-interests              | No    | -     | Create interest   |
| PATCH  | /soft-interests/:id/followup | Yes   | ADMIN | Mark followed up  |

### Notify Subscribers
| Method | Route                  | Auth  | Role  | Description        |
|--------|------------------------|-------|-------|-------------------|
| GET    | /notify-subscribers    | Yes   | ADMIN | List subscribers  |
| POST   | /notify-subscribers    | No    | -     | Subscribe         |

### Export & Logs
| Method | Route              | Auth  | Role  | Description        |
|--------|--------------------|-------|-------|-------------------|
| GET    | /export            | Yes   | ADMIN | Export report     |
| GET    | /logs/session      | Yes   | ADMIN | Session logs      |
| GET    | /logs/audit        | Yes   | ADMIN | Audit logs        |
| GET    | /logs/all          | Yes   | ADMIN | All logs          |

## Request/Response Examples

### POST /api/auth/login
Request:
```json
{ "email": "admin@trustauto.co.ke", "password": "password123" }
```
Response:
```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "user": { "id": "...", "email": "...", "role": "ADMIN" } }
```
Errors: 400 missing fields | 401 invalid credentials

### GET /api/vehicles
Response:
```json
{ "vehicles": [...], "total": 50, "page": 1, "limit": 20 }
```

### POST /api/vehicles/:id/view
Response:
```json
{ "success": true, "viewCount": 157 }
```
