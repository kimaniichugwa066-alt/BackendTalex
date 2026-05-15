"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.replySupportRequest = exports.getAllSupportRequests = exports.getAllPayments = exports.updateUser = exports.deleteUser = exports.resetUserPassword = exports.banUser = exports.getAllUsers = exports.getUserById = exports.updateApplicationStatus = exports.getAllApplications = exports.deleteJob = exports.updateJob = exports.createJob = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
        const applications = await client_1.default.application.findMany({
            include: { user: true, job: true },
            orderBy: { createdAt: 'desc' },
        });
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
        // Use transaction to ensure data consistency
        const application = await client_1.default.$transaction(async (tx) => {
            const updatedApplication = await tx.application.update({
                where: { id: applicationId },
                data: { status },
                include: { user: true, job: true },
            });
            // Create in-app notification
            await tx.notification.create({
                data: {
                    userId: updatedApplication.userId,
                    title: 'Application Status Update',
                    message: `Your application for ${updatedApplication.job.title} has been ${status.toLowerCase()}.`,
                },
            });
            return updatedApplication;
        });
        // Send notification email asynchronously (outside transaction)
        (0, notificationService_1.sendApplicationStatusUpdateEmail)(application.user.email, application.job.title, status).catch(console.error);
        // Invalidate dashboard cache
        (0, cacheService_1.invalidateDashboardCache)().catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Application status updated', { application }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to update application status', error));
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await client_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isVerified: true,
                isBanned: true,
                headline: true,
                location: true,
                summary: true,
                experience: true,
                education: true,
                linkedIn: true,
                createdAt: true,
                updatedAt: true,
                documents: {
                    select: {
                        id: true,
                        type: true,
                        url: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
                applications: {
                    select: {
                        id: true,
                        trackingNumber: true,
                        status: true,
                        paymentStatus: true,
                        createdAt: true,
                        job: {
                            select: {
                                id: true,
                                title: true,
                                company: true,
                                province: true,
                                salary: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                payments: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        mpesaCode: true,
                        phone: true,
                        createdAt: true,
                        job: {
                            select: {
                                id: true,
                                title: true,
                                company: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                notifications: {
                    select: {
                        id: true,
                        title: true,
                        message: true,
                        isRead: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10, // Last 10 notifications
                },
                supportRequests: {
                    select: {
                        id: true,
                        category: true,
                        subject: true,
                        message: true,
                        status: true,
                        reply: true,
                        createdAt: true,
                        repliedAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!user) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('User not found'));
        }
        res.json((0, apiResponse_1.successResponse)('User details loaded', { user }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load user details', error));
    }
};
exports.getUserById = getUserById;
const getAllUsers = async (_req, res) => {
    try {
        const users = await client_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isVerified: true,
                isBanned: true,
                headline: true,
                location: true,
                summary: true,
                experience: true,
                education: true,
                linkedIn: true,
                createdAt: true,
                updatedAt: true,
                documents: {
                    select: {
                        id: true,
                        type: true,
                        url: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
                applications: {
                    select: {
                        id: true,
                        status: true,
                        createdAt: true,
                        job: {
                            select: {
                                id: true,
                                title: true,
                                company: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                payments: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        createdAt: true,
                        job: {
                            select: {
                                id: true,
                                title: true,
                                company: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json((0, apiResponse_1.successResponse)('Users loaded', { users }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load users', error));
    }
};
exports.getAllUsers = getAllUsers;
const banUser = async (req, res) => {
    const { ban } = req.body;
    const { id } = req.params;
    try {
        const user = await client_1.default.user.update({
            where: { id },
            data: { isBanned: ban },
        });
        res.json((0, apiResponse_1.successResponse)('User ban status updated', { user: { id: user.id, email: user.email, isBanned: user.isBanned } }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to update user ban status', error));
    }
};
exports.banUser = banUser;
const resetUserPassword = async (req, res) => {
    const { newPassword, password } = req.body;
    const { id } = req.params;
    const finalPassword = newPassword || password;
    if (!finalPassword) {
        return res.status(400).json((0, apiResponse_1.errorResponse)('Password is required'));
    }
    try {
        const hashedPassword = await bcryptjs_1.default.hash(finalPassword, 10);
        const user = await client_1.default.user.update({
            where: { id },
            data: { password: hashedPassword, resetToken: null },
        });
        (0, notificationService_1.sendEmail)({
            to: user.email,
            subject: 'Your password was reset by admin',
            html: `<p>Your password has been successfully reset by an administrator. If you did not request this, please contact support.</p>`,
        }).catch(console.error);
        res.json((0, apiResponse_1.successResponse)('User password reset successfully', { user: { id: user.id, email: user.email } }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to reset user password', error));
    }
};
exports.resetUserPassword = resetUserPassword;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await client_1.default.user.delete({ where: { id } });
        res.json((0, apiResponse_1.successResponse)('User deleted successfully'));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to delete user', error));
    }
};
exports.deleteUser = deleteUser;
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, headline, location, summary, experience, education, linkedIn } = req.body;
    try {
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (email !== undefined)
            updateData.email = email;
        if (phone !== undefined)
            updateData.phone = phone;
        if (headline !== undefined)
            updateData.headline = headline;
        if (location !== undefined)
            updateData.location = location;
        if (summary !== undefined)
            updateData.summary = summary;
        if (experience !== undefined)
            updateData.experience = experience;
        if (education !== undefined)
            updateData.education = education;
        if (linkedIn !== undefined)
            updateData.linkedIn = linkedIn;
        const user = await client_1.default.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                headline: true,
                location: true,
                summary: true,
                experience: true,
                education: true,
                linkedIn: true,
                isVerified: true,
                isBanned: true,
            },
        });
        res.json((0, apiResponse_1.successResponse)('User updated successfully', { user }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to update user', error));
    }
};
exports.updateUser = updateUser;
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
const getAllSupportRequests = async (_req, res) => {
    try {
        const supportRequests = await client_1.default.supportRequest.findMany({
            include: { user: { select: { id: true, name: true, email: true, phone: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json((0, apiResponse_1.successResponse)('Support requests loaded', { supportRequests }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load support requests', error));
    }
};
exports.getAllSupportRequests = getAllSupportRequests;
const replySupportRequest = async (req, res) => {
    const { requestId, reply } = req.body;
    try {
        const supportRequest = await client_1.default.supportRequest.update({
            where: { id: requestId },
            data: {
                reply,
                status: 'CLOSED',
                repliedAt: new Date(),
            },
            include: { user: true },
        });
        const html = `
      <h1>Support Request Response</h1>
      <p>Thank you for contacting Talex Support.</p>
      <p><strong>Your Issue:</strong> ${supportRequest.subject}</p>
      <p><strong>Our Response:</strong><br/>${reply}</p>
      <p>Best regards,<br>The Talex Team</p>
    `;
        (0, notificationService_1.sendEmail)({
            to: supportRequest.user.email,
            subject: `Re: ${supportRequest.subject}`,
            html,
        }).catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Support request replied', { supportRequest }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to reply to support request', error));
    }
};
exports.replySupportRequest = replySupportRequest;
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
