"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || '4000',
    jwtSecret: process.env.JWT_SECRET || 'secret-key',
    databaseUrl: process.env.DATABASE_URL || '',
    mpesa: {
        consumerKey: process.env.MPESA_CONSUMER_KEY || '',
        consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
        shortcode: process.env.MPESA_SHORTCODE || '',
        passkey: process.env.MPESA_PASSKEY || '',
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },
    email: {
        host: process.env.EMAIL_HOST || '',
        port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
    },
    brevo: {
        apiKey: process.env.BREVO_API_KEY || '',
        senderEmail: process.env.BREVO_SENDER_EMAIL || '',
        senderName: process.env.BREVO_SENDER_NAME || 'Talex Team',
    },
    supportEmail: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER || '',
    sms: {
        apiKey: process.env.SMS_API_KEY || '',
        username: process.env.SMS_USERNAME || '',
    },
    redisUrl: process.env.REDIS_URL || '',
};
