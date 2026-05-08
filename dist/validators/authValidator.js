"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordWithTokenSchema = exports.forgotPasswordSchema = exports.resetPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const kenyaPhoneRegex = /^(?:\+254|0)7\d{8}$/;
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2),
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().regex(kenyaPhoneRegex, 'Invalid Kenyan phone number'),
        password: zod_1.z.string().min(8),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        newPassword: zod_1.z.string().min(8),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.resetPasswordWithTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string(),
        newPassword: zod_1.z.string().min(8),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
