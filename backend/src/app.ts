import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import authRoutes from './routes/auth';
import vehicleRoutes from './routes/vehicles';
import inquiryRoutes from './routes/inquiries';
import analyticsRoutes from './routes/analytics';
import bulkRoutes from './routes/bulk';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '../uploads')
  : path.join(process.cwd(), 'uploads');

app.use('/uploads', express.static(uploadsPath));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({
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
    },
    documentation: 'See README.md for API documentation',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/bulk', bulkRoutes);

app.use(errorHandler);

export default app;
