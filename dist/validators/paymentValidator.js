"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentSchema = exports.stkPushSchema = void 0;
const zod_1 = require("zod");
exports.stkPushSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z.string().min(9),
        amount: zod_1.z.number().int().positive(),
        jobId: zod_1.z.string().uuid(),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.verifyPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentId: zod_1.z.string().uuid(),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
