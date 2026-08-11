import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import leadRoutes from './routes/leadRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import faqRoutes from './routes/faqRoutes';
import mediaRoutes from './routes/mediaRoutes';
import settingRoutes from './routes/settingRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { connectDB } from './config/db';
import { globalErrorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';

dotenv.config();

const app: Application = express();

// Enable trust proxy for Vercel reverse proxy
app.set('trust proxy', 1);

// Ensure Database Connection for serverless Vercel environment
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('[Database Connection Warning]', err);
  }
  next();
});

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Rate limiting for public lead submission & auth
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  validate: { trustProxy: false, xForwardedForHeader: false },
});
app.use('/api', apiLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploaded media files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check endpoint
app.get(['/api/v1/health', '/v1/health'], (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Vihaan Tax Solutions API is operational' });
});

// API Routes
app.use(['/api/v1/auth', '/v1/auth', '/auth'], authRoutes);
app.use(['/api/v1/services', '/v1/services', '/services'], serviceRoutes);
app.use(['/api/v1/leads', '/v1/leads', '/leads'], leadRoutes);
app.use(['/api/v1/testimonials', '/v1/testimonials', '/testimonials'], testimonialRoutes);
app.use(['/api/v1/faqs', '/v1/faqs', '/faqs'], faqRoutes);
app.use(['/api/v1/media', '/v1/media', '/media'], mediaRoutes);
app.use(['/api/v1/settings', '/v1/settings', '/settings'], settingRoutes);
app.use(['/api/v1/dashboard', '/v1/dashboard', '/dashboard'], dashboardRoutes);

// Handle unhandled routes
app.all('*', (req: Request, _res: Response, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global Error Middleware
app.use(globalErrorHandler);

export default app;
