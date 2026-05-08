"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replySupportRequestSchema = exports.updateApplicationStatusSchema = exports.updateJobSchema = exports.jobSchema = void 0;
const zod_1 = require("zod");
const jobPayload = zod_1.z.object({
    title: zod_1.z.string().min(3),
    company: zod_1.z.string().min(2),
    description: zod_1.z.string().min(10),
    requirements: zod_1.z.string().min(10),
    benefits: zod_1.z.string().optional(),
    salary: zod_1.z.string().optional(),
    province: zod_1.z.string().min(2),
    visaSponsored: zod_1.z.boolean().optional().default(false),
    deadline: zod_1.z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
        message: 'Invalid deadline format',
    }),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
exports.jobSchema = zod_1.z.object({
    body: jobPayload,
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.updateJobSchema = zod_1.z.object({
    body: jobPayload.partial(),
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
    query: zod_1.z.object({}),
});
exports.updateApplicationStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        applicationId: zod_1.z.string().uuid(),
        status: zod_1.z.enum(['SUBMITTED', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW', 'APPROVED', 'REJECTED']),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.replySupportRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        requestId: zod_1.z.string().uuid(),
        reply: zod_1.z.string().min(10),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
