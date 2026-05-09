"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const pipelineRoutes_1 = __importDefault(require("./routes/pipelineRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const supportRoutes_1 = __importDefault(require("./routes/supportRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const authMiddleware_1 = require("./middleware/authMiddleware");
const cronJobs_1 = require("./jobs/cronJobs");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('trust proxy', 1); // 👈 MUST BE HERE - Enable trust proxy for rate limiting
app.use((0, helmet_1.default)());
// CORS configuration - for production use specific origin, for testing use: app.use(cors());
app.use((0, cors_1.default)({
    origin: "https://talex-one.vercel.app/",
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
const limiter = (0, express_rate_limit_1.default)({
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
app.use('/api/auth', authRoutes_1.default);
app.use('/api/jobs', jobRoutes_1.default);
app.use('/api/applications', authMiddleware_1.authMiddleware, applicationRoutes_1.default);
app.use('/api/payments', authMiddleware_1.authMiddleware, paymentRoutes_1.default);
app.use('/api/upload', authMiddleware_1.authMiddleware, uploadRoutes_1.default);
app.use('/api/notifications', authMiddleware_1.authMiddleware, notificationRoutes_1.default);
app.use('/api/pipeline', authMiddleware_1.authMiddleware, pipelineRoutes_1.default);
app.use('/api/profile', authMiddleware_1.authMiddleware, profileRoutes_1.default);
app.use('/api/support', authMiddleware_1.authMiddleware, supportRoutes_1.default);
app.use('/api/admin', authMiddleware_1.authMiddleware, adminRoutes_1.default);
app.use('/api/report', authMiddleware_1.authMiddleware, reportRoutes_1.default);
app.use(errorHandler_1.errorHandler);
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
// Start cron jobs
(0, cronJobs_1.startCronJobs)();
exports.default = app;
