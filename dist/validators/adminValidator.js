"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateUserSchema = exports.adminResetPasswordSchema = exports.adminBanUserSchema = void 0;
const zod_1 = require("zod");
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const internationalPhoneRegex = /^\+?\d{10,15}$/;
exports.adminBanUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        ban: zod_1.z.boolean(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    query: zod_1.z.object({}),
});
exports.adminResetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        newPassword: zod_1.z.string().regex(passwordRegex, 'Password must be at least 8 characters with uppercase, number, and special character'),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    query: zod_1.z.object({}),
});
exports.adminUpdateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().regex(internationalPhoneRegex, 'Invalid phone number format').optional(),
        headline: zod_1.z.string().max(255).optional(),
        location: zod_1.z.string().max(255).optional(),
        summary: zod_1.z.string().optional(),
        experience: zod_1.z.string().optional(),
        education: zod_1.z.string().optional(),
        linkedIn: zod_1.z.string().url().optional(),
    }).partial(),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    query: zod_1.z.object({}),
});
