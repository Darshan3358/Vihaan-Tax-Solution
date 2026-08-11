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

// Ensure Database Connection for serverless Vercel environment
app.use(async (_req, _res, next) => {
  await connectDB();
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
  max: 200,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use('/api', apiLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploaded media files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check endpoint
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Vihaan Tax Solutions API is operational' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/faqs', faqRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/settings', settingRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Handle unhandled routes
app.all('*', (req: Request, _res: Response, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global Error Middleware
app.use(globalErrorHandler);

export default app;
