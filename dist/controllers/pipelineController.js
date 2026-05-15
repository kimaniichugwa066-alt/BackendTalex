"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectApplication = exports.markHired = exports.sendOffer = exports.scheduleInterview = exports.reviewApplication = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const apiResponse_1 = require("../utils/apiResponse");
const notificationService_1 = require("../services/notificationService");
const createNotification = async (userId, title, message) => {
    await client_1.default.notification.create({
        data: {
            userId,
            title,
            message,
        },
    });
};
const reviewApplication = async (req, res) => {
    const { id } = req.params;
    try {
        const application = await client_1.default.application.findUnique({
            where: { id },
            include: { user: true, job: true },
        });
        if (!application) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('Application not found'));
        }
        // Use transaction to ensure data consistency
        const updatedApplication = await client_1.default.$transaction(async (tx) => {
            const app = await tx.application.update({
                where: { id },
                data: { status: 'UNDER_REVIEW' },
                include: { user: true, job: true },
            });
            await tx.notification.create({
                data: {
                    userId: app.userId,
                    title: 'Application Under Review',
                    message: `Your application for ${app.job.title} is now under review.`,
                },
            });
            return app;
        });
        await (0, notificationService_1.sendApplicationStatusUpdateEmail)(updatedApplication.user.email, updatedApplication.job.title, 'UNDER_REVIEW').catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Application moved to under review', { application: updatedApplication }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to update application status', error));
    }
};
exports.reviewApplication = reviewApplication;
const scheduleInterview = async (req, res) => {
    const { id } = req.params;
    const { date, link } = req.body;
    try {
        const application = await client_1.default.application.findUnique({
            where: { id },
            include: { user: true, job: true },
        });
        if (!application) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('Application not found'));
        }
        const interviewDate = new Date(date);
        // Use transaction to ensure data consistency
        const updatedApplication = await client_1.default.$transaction(async (tx) => {
            const app = await tx.application.update({
                where: { id },
                data: {
                    status: 'INTERVIEW_SCHEDULED',
                    interviewDate,
                    interviewLink: link,
                },
                include: { user: true, job: true },
            });
            await tx.notification.create({
                data: {
                    userId: app.userId,
                    title: 'Interview Scheduled',
                    message: `Your interview for ${app.job.title} is scheduled for ${interviewDate.toISOString()}.`,
                },
            });
            return app;
        });
        await (0, notificationService_1.sendInterviewScheduledEmail)(updatedApplication.user.email, updatedApplication.job.title, interviewDate.toISOString(), link).catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Interview scheduled', { application: updatedApplication }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to schedule interview', error));
    }
};
exports.scheduleInterview = scheduleInterview;
const sendOffer = async (req, res) => {
    const { id } = req.params;
    try {
        const application = await client_1.default.application.findUnique({
            where: { id },
            include: { user: true, job: true },
        });
        if (!application) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('Application not found'));
        }
        // Use transaction to ensure data consistency
        const updatedApplication = await client_1.default.$transaction(async (tx) => {
            const app = await tx.application.update({
                where: { id },
                data: { status: 'OFFER_SENT' },
                include: { user: true, job: true },
            });
            await tx.notification.create({
                data: {
                    userId: app.userId,
                    title: 'Offer Sent',
                    message: `An offer has been sent for your application to ${app.job.title}.`,
                },
            });
            return app;
        });
        await (0, notificationService_1.sendOfferEmail)(updatedApplication.user.email, updatedApplication.job.title).catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Offer sent', { application: updatedApplication }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to send offer', error));
    }
};
exports.sendOffer = sendOffer;
const markHired = async (req, res) => {
    const { id } = req.params;
    try {
        const application = await client_1.default.application.findUnique({
            where: { id },
            include: { user: true, job: true },
        });
        if (!application) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('Application not found'));
        }
        // Use transaction to ensure data consistency
        const updatedApplication = await client_1.default.$transaction(async (tx) => {
            const app = await tx.application.update({
                where: { id },
                data: { status: 'HIRED' },
                include: { user: true, job: true },
            });
            await tx.notification.create({
                data: {
                    userId: app.userId,
                    title: 'Hired',
                    message: `Congratulations! You have been hired for ${app.job.title}.`,
                },
            });
            return app;
        });
        await (0, notificationService_1.sendHiredEmail)(updatedApplication.user.email, updatedApplication.job.title).catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Applicant marked as hired', { application: updatedApplication }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to mark applicant as hired', error));
    }
};
exports.markHired = markHired;
const rejectApplication = async (req, res) => {
    const { id } = req.params;
    try {
        const application = await client_1.default.application.findUnique({
            where: { id },
            include: { user: true, job: true },
        });
        if (!application) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('Application not found'));
        }
        // Use transaction to ensure data consistency
        const updatedApplication = await client_1.default.$transaction(async (tx) => {
            const app = await tx.application.update({
                where: { id },
                data: { status: 'REJECTED' },
                include: { user: true, job: true },
            });
            await tx.notification.create({
                data: {
                    userId: app.userId,
                    title: 'Application Rejected',
                    message: `Your application for ${app.job.title} has been rejected.`,
                },
            });
            return app;
        });
        await (0, notificationService_1.sendRejectedEmail)(updatedApplication.user.email, updatedApplication.job.title).catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Application rejected', { application: updatedApplication }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to reject application', error));
    }
};
exports.rejectApplication = rejectApplication;
