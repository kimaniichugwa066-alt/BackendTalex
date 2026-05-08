"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
const kenyaPhoneRegex = /^(?:\+254|0)7\d{8}$/;
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        phone: zod_1.z.string().regex(kenyaPhoneRegex, 'Invalid Kenyan phone number').optional(),
        headline: zod_1.z.string().max(120).optional(),
        location: zod_1.z.string().max(100).optional(),
        summary: zod_1.z.string().max(1000).optional(),
        experience: zod_1.z.string().max(1000).optional(),
        education: zod_1.z.string().max(1000).optional(),
        linkedIn: zod_1.z.string().url().optional(),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
