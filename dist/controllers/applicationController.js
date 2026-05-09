"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationById = exports.getUserApplications = exports.createApplication = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const apiResponse_1 = require("../utils/apiResponse");
const notificationService_1 = require("../services/notificationService");
const cacheService_1 = require("../services/cacheService");
const createApplication = async (req, res) => {
    const { jobId, paymentId } = req.body;
    const userId = req.user?.id;
    try {
        const payment = await client_1.default.payment.findUnique({ where: { id: paymentId } });
        if (!payment || payment.status !== 'SUCCESS') {
            return res.status(400).json((0, apiResponse_1.errorResponse)('Payment must be completed before applying'));
        }
        if (payment.userId !== userId || payment.jobId !== jobId) {
            return res.status(403).json((0, apiResponse_1.errorResponse)('Payment does not match application data'));
        }
        const application = await client_1.default.application.create({
            data: {
                trackingNumber: `TLX-${Date.now()}`,
                userId: userId,
                jobId,
                status: 'APPLIED',
                paymentStatus: 'SUCCESS',
                paymentId,
            },
            include: { job: true, user: true },
        });
        // Send notification email asynchronously
        (0, notificationService_1.sendApplicationSubmittedEmail)(application.user.email, application.job.title, application.trackingNumber).catch(console.error);
        // Create in-app notification
        await client_1.default.notification.create({
            data: {
                userId: userId,
                title: 'Application Submitted',
                message: `Your application for ${application.job.title} has been submitted successfully.`,
            },
        });
        // Invalidate dashboard cache
        (0, cacheService_1.invalidateDashboardCache)().catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Application submitted', { application }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to create application', error));
    }
};
exports.createApplication = createApplication;
const getUserApplications = async (req, res) => {
    try {
        const applications = await client_1.default.application.findMany({
            where: { userId: req.user?.id },
            include: { job: true },
        });
        res.json((0, apiResponse_1.successResponse)('User applications loaded', { applications }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load applications', error));
    }
};
exports.getUserApplications = getUserApplications;
const getApplicationById = async (req, res) => {
    const { id } = req.params;
    try {
        const application = await client_1.default.application.findUnique({
            where: { id },
            include: { job: true },
        });
        if (!application) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('Application not found'));
        }
        if (application.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
            return res.status(403).json((0, apiResponse_1.errorResponse)('Access denied'));
        }
        res.json((0, apiResponse_1.successResponse)('Application loaded', { application }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load application', error));
    }
};
exports.getApplicationById = getApplicationById;
