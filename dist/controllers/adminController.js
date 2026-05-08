"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.getAllPayments = exports.getAllUsers = exports.updateApplicationStatus = exports.getAllApplications = exports.deleteJob = exports.updateJob = exports.createJob = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const apiResponse_1 = require("../utils/apiResponse");
const notificationService_1 = require("../services/notificationService");
const cacheService_1 = require("../services/cacheService");
const createJob = async (req, res) => {
    try {
        const job = await client_1.default.job.create({ data: { ...req.body, deadline: new Date(req.body.deadline) } });
        // Invalidate jobs cache
        (0, cacheService_1.invalidateJobsCache)().catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Job created', { job }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to create job', error));
    }
};
exports.createJob = createJob;
const updateJob = async (req, res) => {
    const { id } = req.params;
    try {
        const job = await client_1.default.job.update({
            where: { id },
            data: { ...req.body, deadline: req.body.deadline ? new Date(req.body.deadline) : undefined },
        });
        // Invalidate caches
        (0, cacheService_1.invalidateJobsCache)().catch(console.error);
        (0, cacheService_1.invalidateJobDetailCache)(id).catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Job updated', { job }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to update job', error));
    }
};
exports.updateJob = updateJob;
const deleteJob = async (req, res) => {
    const { id } = req.params;
    try {
        await client_1.default.job.delete({ where: { id } });
        // Invalidate caches
        (0, cacheService_1.invalidateJobsCache)().catch(console.error);
        (0, cacheService_1.invalidateJobDetailCache)(id).catch(console.error);
        (0, cacheService_1.invalidateDashboardCache)().catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Job deleted'));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to delete job', error));
    }
};
exports.deleteJob = deleteJob;
const getAllApplications = async (_req, res) => {
    try {
        const applications = await client_1.default.application.findMany({ include: { user: true, job: true } });
        res.json((0, apiResponse_1.successResponse)('Applications loaded', { applications }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load applications', error));
    }
};
exports.getAllApplications = getAllApplications;
const updateApplicationStatus = async (req, res) => {
    const { applicationId, status } = req.body;
    try {
        const application = await client_1.default.application.update({
            where: { id: applicationId },
            data: { status },
            include: { user: true, job: true },
        });
        // Send notification email asynchronously
        (0, notificationService_1.sendApplicationStatusUpdateEmail)(application.user.email, application.job.title, status).catch(console.error);
        // Create in-app notification
        await client_1.default.notification.create({
            data: {
                userId: application.userId,
                title: 'Application Status Update',
                message: `Your application for ${application.job.title} has been ${status.toLowerCase()}.`,
            },
        });
        // Invalidate dashboard cache
        (0, cacheService_1.invalidateDashboardCache)().catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Application status updated', { application }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to update application status', error));
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
const getAllUsers = async (_req, res) => {
    try {
        const users = await client_1.default.user.findMany({ select: { id: true, name: true, email: true, phone: true, role: true, isVerified: true, createdAt: true } });
        res.json((0, apiResponse_1.successResponse)('Users loaded', { users }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load users', error));
    }
};
exports.getAllUsers = getAllUsers;
const getAllPayments = async (_req, res) => {
    try {
        const payments = await client_1.default.payment.findMany({ include: { user: true, job: true } });
        res.json((0, apiResponse_1.successResponse)('Payments loaded', { payments }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load payments', error));
    }
};
exports.getAllPayments = getAllPayments;
const getDashboardStats = async (_req, res) => {
    try {
        // Try to get from cache first
        const cachedStats = await (0, cacheService_1.getCachedDashboardStats)();
        if (cachedStats) {
            return res.json((0, apiResponse_1.successResponse)('Dashboard stats loaded from cache', cachedStats));
        }
        const totalUsers = await client_1.default.user.count();
        const totalJobs = await client_1.default.job.count();
        const totalApplications = await client_1.default.application.count();
        const revenue = await client_1.default.payment.aggregate({ _sum: { amount: true } });
        const stats = {
            totalUsers,
            totalJobs,
            totalApplications,
            revenue: revenue._sum.amount || 0,
        };
        // Cache the stats
        await (0, cacheService_1.cacheDashboardStats)(stats);
        res.json((0, apiResponse_1.successResponse)('Dashboard stats loaded', stats));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load dashboard', error));
    }
};
exports.getDashboardStats = getDashboardStats;
