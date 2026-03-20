# Environment Variables

⚠️ Never commit real values. This documents keys only.

## Frontend (.env.local)
| Key                          | Used In            | Purpose              |
|------------------------------|--------------------|----------------------|
| NEXT_PUBLIC_API_URL          | All API fetches    | Backend base URL     |
| NEXT_PUBLIC_SITE_URL         | Share/SEO          | Public domain        |
| NEXT_PUBLIC_CLOUDINARY_CLOUD | Image display      | Cloudinary cloud name|

Example:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD=your-cloud-name
```

## Backend (.env)
| Key                  | Purpose                                |
|----------------------|----------------------------------------|
| DATABASE_URL         | SQLite file path or Postgres URL       |
| JWT_SECRET           | Token signing — 64 char random string  |
| JWT_EXPIRES_IN       | Token expiry (default: 7d)             |
| NODE_ENV             | development / production               |
| PORT                 | Server port (default: 5000)            |
| FRONTEND_URL         | CORS whitelist — frontend domain       |
| CLOUDINARY_CLOUD_NAME| Image uploads                          |
| CLOUDINARY_API_KEY   | Image uploads                          |
| CLOUDINARY_API_SECRET| Image uploads                          |
| VAPID_PUBLIC_KEY     | Push notifications (optional)          |
| VAPID_PRIVATE_KEY    | Push notifications (optional)          |
| VAPID_EMAIL          | Push notifications (optional)          |
| MPESA_CONSUMER_KEY   | M-Pesa integration (optional)          |
| MPESA_CONSUMER_SECRET| M-Pesa integration (optional)          |
| MPESA_SHORTCODE      | M-Pesa integration (optional)          |
| MPESA_PASSKEY        | M-Pesa integration (optional)          |
| MPESA_CALLBACK_URL   | M-Pesa callback URL                    |
| MPESA_ENV            | sandbox / production                   |

Example:
```
DATABASE_URL=file:./dev.db
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-64-chars
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
```

## Production Checklist
- [ ] All NEXT_PUBLIC_* vars set in Vercel/Render
- [ ] JWT_SECRET is 64+ characters
- [ ] FRONTEND_URL matches production domain
- [ ] CLOUDINARY_* vars configured
- [ ] DATABASE_URL points to production DB
- [ ] NODE_ENV=production
