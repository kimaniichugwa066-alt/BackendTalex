"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const zod_1 = require("zod");
const reportSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum(['applications', 'jobs', 'users', 'revenue']),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware);
router.post('/', (0, validateRequest_1.validateRequest)(reportSchema), reportController_1.generateReport);
exports.default = router;
