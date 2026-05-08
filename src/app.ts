import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import applicationRoutes from './routes/applicationRoutes';
import paymentRoutes from './routes/paymentRoutes';
import uploadRoutes from './routes/uploadRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/authMiddleware';
import { connectRedis } from './utils/redis';
import { startCronJobs } from './jobs/cronJobs';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', authMiddleware, applicationRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/upload', authMiddleware, uploadRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

app.use(errorHandler);

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'BackendTalex API is running' });
});

// Initialize Redis and start cron jobs
connectRedis().then(() => {
  console.log('Redis connected');
  startCronJobs();
}).catch((error) => {
  console.error('Failed to connect to Redis:', error);
});

export default app;
