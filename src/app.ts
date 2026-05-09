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
import pipelineRoutes from './routes/pipelineRoutes';
import adminRoutes from './routes/adminRoutes';
import reportRoutes from './routes/reportRoutes';
import profileRoutes from './routes/profileRoutes';
import supportRoutes from './routes/supportRoutes';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/authMiddleware';
import { connectRedis } from './utils/redis';
import { startCronJobs } from './jobs/cronJobs';

dotenv.config();

const app = express();

app.set('trust proxy', 1); // 👈 MUST BE HERE - Enable trust proxy for rate limiting

app.use(helmet());
// CORS configuration - for production use specific origin, for testing use: app.use(cors());
app.use(cors({
  origin: "https://talex-one.vercel.app/",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Reduced from 120 to 100 (recommended)
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// Handle favicon requests
app.get('/favicon.ico', (_req, res) => {
  res.status(204).send();
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', authMiddleware, applicationRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/upload', authMiddleware, uploadRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/pipeline', authMiddleware, pipelineRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);
app.use('/api/support', authMiddleware, supportRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/report', authMiddleware, reportRoutes);

app.use(errorHandler);

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'BackendTalex API is running' });
});

app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is working 🚀',
    uptime: process.uptime()
  });
});

app.get('/health', async (_req, res) => {
  res.json({
    success: true,
    database: 'connected'
  });
});

// Initialize Redis and start cron jobs (optional - won't crash if Redis fails)
connectRedis().then(() => {
  console.log('✅ Redis connected');
  startCronJobs();
}).catch((error: Error) => {
  console.warn('⚠️ Redis connection failed (optional):', error.message);
  console.log('🚀 Starting without Redis - some features may be limited');
  // Still start cron jobs even if Redis fails
  startCronJobs();
});

export default app;
