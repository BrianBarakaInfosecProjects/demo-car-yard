import express, { Request, Response, NextFunction } from 'express';
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
import { errorHandler } from './middleware/errorHandler';
import { limiter, authLimiter } from './middleware/rateLimiter';

const app = express();

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
    const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000,http://127.0.0.1:3000').split(',');
    if (!origin || allowedOrigins.includes(origin)) {
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

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'connected',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
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
    },
    documentation: 'See README.md for API documentation',
  });
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/bulk', bulkRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

export default app;
