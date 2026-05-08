"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportRequestSchema = void 0;
const zod_1 = require("zod");
exports.supportRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        category: zod_1.z.enum(['TECHNICAL', 'PAYMENT', 'JOB_POSTING', 'OTHER']),
        subject: zod_1.z.string().min(3),
        message: zod_1.z.string().min(10),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
