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
        const updatedApplication = await client_1.default.application.update({
            where: { id },
            data: { status: 'UNDER_REVIEW' },
            include: { user: true, job: true },
        });
        await (0, notificationService_1.sendApplicationStatusUpdateEmail)(updatedApplication.user.email, updatedApplication.job.title, 'UNDER_REVIEW').catch(console.error);
        await createNotification(updatedApplication.userId, 'Application Under Review', `Your application for ${updatedApplication.job.title} is now under review.`);
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
        const updatedApplication = await client_1.default.application.update({
            where: { id },
            data: {
                status: 'INTERVIEW_SCHEDULED',
                interviewDate,
                interviewLink: link,
            },
            include: { user: true, job: true },
        });
        await (0, notificationService_1.sendInterviewScheduledEmail)(updatedApplication.user.email, updatedApplication.job.title, interviewDate.toISOString(), link).catch(console.error);
        await createNotification(updatedApplication.userId, 'Interview Scheduled', `Your interview for ${updatedApplication.job.title} is scheduled for ${interviewDate.toISOString()}.`);
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
        const updatedApplication = await client_1.default.application.update({
            where: { id },
            data: { status: 'OFFER_SENT' },
            include: { user: true, job: true },
        });
        await (0, notificationService_1.sendOfferEmail)(updatedApplication.user.email, updatedApplication.job.title).catch(console.error);
        await createNotification(updatedApplication.userId, 'Offer Sent', `An offer has been sent for your application to ${updatedApplication.job.title}.`);
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
        const updatedApplication = await client_1.default.application.update({
            where: { id },
            data: { status: 'HIRED' },
            include: { user: true, job: true },
        });
        await (0, notificationService_1.sendHiredEmail)(updatedApplication.user.email, updatedApplication.job.title).catch(console.error);
        await createNotification(updatedApplication.userId, 'Hired', `Congratulations! You have been hired for ${updatedApplication.job.title}.`);
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
        const updatedApplication = await client_1.default.application.update({
            where: { id },
            data: { status: 'REJECTED' },
            include: { user: true, job: true },
        });
        await (0, notificationService_1.sendRejectedEmail)(updatedApplication.user.email, updatedApplication.job.title).catch(console.error);
        await createNotification(updatedApplication.userId, 'Application Rejected', `Your application for ${updatedApplication.job.title} has been rejected.`);
        res.json((0, apiResponse_1.successResponse)('Application rejected', { application: updatedApplication }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to reject application', error));
    }
};
exports.rejectApplication = rejectApplication;
