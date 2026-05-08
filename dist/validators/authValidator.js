"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2),
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().min(9),
        password: zod_1.z.string().min(6),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        newPassword: zod_1.z.string().min(6),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
