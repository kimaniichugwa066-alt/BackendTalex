"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordWithTokenSchema = exports.forgotPasswordSchema = exports.resetPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// Allow international phone format: with optional +, 10-15 digits
const internationalPhoneRegex = /^\+?\d{10,15}$/;
// Better email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Password: minimum 8 characters, at least one uppercase, one number, one special char
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        email: zod_1.z.string().regex(emailRegex, 'Invalid email format'),
        phone: zod_1.z.string().regex(internationalPhoneRegex, 'Invalid phone number. Use format: +[country code][number] or [10-15 digits]').optional(),
        phoneNumber: zod_1.z.string().regex(internationalPhoneRegex, 'Invalid phone number. Use format: +[country code][number] or [10-15 digits]').optional(),
        password: zod_1.z.string().regex(passwordRegex, 'Password must be at least 8 characters with uppercase, number, and special character'),
    }).refine((data) => data.phone || data.phoneNumber, {
        message: "Either phone or phoneNumber is required",
        path: ["phone"],
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().regex(emailRegex, 'Invalid email format'),
        password: zod_1.z.string().min(8),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().regex(emailRegex, 'Invalid email format'),
        newPassword: zod_1.z.string().regex(passwordRegex, 'Password must be at least 8 characters with uppercase, number, and special character'),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().regex(emailRegex, 'Invalid email format'),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.resetPasswordWithTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string(),
        newPassword: zod_1.z.string().regex(passwordRegex, 'Password must be at least 8 characters with uppercase, number, and special character'),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
