"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationSchema = void 0;
const zod_1 = require("zod");
exports.createApplicationSchema = zod_1.z.object({
    body: zod_1.z.object({
        jobId: zod_1.z.string().uuid(),
        paymentId: zod_1.z.string().uuid(),
        coverLetter: zod_1.z.string().min(20, 'Cover letter is required and must be at least 20 characters'),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
