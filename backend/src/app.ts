import express, { Request, Response, NextFunction } from 'express';
import prisma from './config/database';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import authRoutes from './routes/auth';
import vehicleRoutes from './routes/vehicles';
import inquiryRoutes from './routes/inquiries';
import analyticsRoutes from './routes/analytics';
import bulkRoutes from './routes/bulk';
import logsRoutes from './routes/logs';
import notificationRoutes from './routes/notifications';
import userRoutes from './routes/users';
import notifySubscriberRoutes from './routes/notifySubscribers';
import softInterestRoutes from './routes/softInterests';
import reservationRoutes from './routes/reservations';
import mpesaRoutes from './routes/mpesa';
import carReferenceRoutes from './routes/carReference';
import settingsRoutes from './routes/settings';
import exportRoutes from './routes/export';
import { errorHandler } from './middleware/errorHandler';
import { limiter, authLimiter } from './middleware/rateLimiter';

const app = express();

app.set('trust proxy', process.env.TRUST_PROXY === 'true');

// Request ID middleware for tracking
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).id = req.get('x-request-id') || uuidv4();
  res.setHeader('x-request-id', (req as any).id);
  next();
});

app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

app.use(cors({
  origin: function (origin, callback) {
    const frontendUrl = process.env.FRONTEND_URL;
    const allowedOrigins: string[] = [];

    // Always allow the configured frontend URL
    if (frontendUrl) {
      allowedOrigins.push(...frontendUrl.split(','));
    }

    // Only allow localhost origins in development
    if (process.env.NODE_ENV !== 'production') {
      allowedOrigins.push(
        'http://localhost:3000',
        'https://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001'
      );
    }

    // Add explicit FRONTEND_HOST if set
    const traefikHost = process.env.FRONTEND_HOST;
    if (traefikHost) {
      allowedOrigins.push(`http://${traefikHost}`);
      allowedOrigins.push(`https://${traefikHost}`);
    }

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '../uploads')
  : path.join(process.cwd(), 'uploads');

app.use('/uploads', express.static(uploadsPath));


// Health check endpoint with database verification
app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }
  
  const health = {
    success: true,
    status: dbStatus === 'connected' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  };
  
  res.status(dbStatus === 'connected' ? 200 : 503).json(health);
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TrustAuto Kenya API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      vehicles: '/api/vehicles',
      inquiries: '/api/inquiries',
      analytics: '/api/analytics',
      bulk: '/api/bulk',
      logs: '/api/logs',
      notifications: '/api/notifications',
      users: '/api/users',
    },
    documentation: 'See README.md for API documentation',
  });
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/notify-subscribers', notifySubscriberRoutes);
app.use('/api/soft-interests', softInterestRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/bulk', bulkRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/car-reference', carReferenceRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/export', exportRoutes);

app.use(errorHandler);

export default app;
