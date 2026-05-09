"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleInterviewSchema = void 0;
const zod_1 = require("zod");
exports.scheduleInterviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
            message: 'Invalid date format',
        }),
        link: zod_1.z.string().min(5),
    }),
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
    query: zod_1.z.object({}),
});
