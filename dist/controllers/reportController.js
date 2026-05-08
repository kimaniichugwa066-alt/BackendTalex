"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const apiResponse_1 = require("../utils/apiResponse");
const generateReport = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.body;
        let reportData;
        switch (type) {
            case 'applications':
                reportData = await generateApplicationsReport(startDate, endDate);
                break;
            case 'jobs':
                reportData = await generateJobsReport(startDate, endDate);
                break;
            case 'users':
                reportData = await generateUsersReport(startDate, endDate);
                break;
            case 'revenue':
                reportData = await generateRevenueReport(startDate, endDate);
                break;
            default:
                return res.status(400).json((0, apiResponse_1.errorResponse)('Invalid report type'));
        }
        res.json((0, apiResponse_1.successResponse)('Report generated successfully', reportData));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to generate report', error));
    }
};
exports.generateReport = generateReport;
const generateApplicationsReport = async (startDate, endDate) => {
    const whereClause = {};
    if (startDate && endDate) {
        whereClause.createdAt = {
            gte: new Date(startDate),
            lte: new Date(endDate),
        };
    }
    const applications = await client_1.default.application.findMany({
        where: whereClause,
        include: {
            job: true,
            user: {
                select: { name: true, email: true },
            },
        },
    });
    return {
        type: 'applications',
        total: applications.length,
        data: applications,
    };
};
const generateJobsReport = async (startDate, endDate) => {
    const whereClause = {};
    if (startDate && endDate) {
        whereClause.createdAt = {
            gte: new Date(startDate),
            lte: new Date(endDate),
        };
    }
    const jobs = await client_1.default.job.findMany({
        where: whereClause,
        include: {
            applications: true,
        },
    });
    return {
        type: 'jobs',
        total: jobs.length,
        data: jobs.map(job => ({
            ...job,
            applicationCount: job.applications.length,
        })),
    };
};
const generateUsersReport = async (startDate, endDate) => {
    const whereClause = {};
    if (startDate && endDate) {
        whereClause.createdAt = {
            gte: new Date(startDate),
            lte: new Date(endDate),
        };
    }
    const users = await client_1.default.user.findMany({
        where: whereClause,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isVerified: true,
            createdAt: true,
            applications: {
                select: {
                    id: true,
                    status: true,
                },
            },
        },
    });
    return {
        type: 'users',
        total: users.length,
        data: users.map(user => ({
            ...user,
            applicationCount: user.applications.length,
        })),
    };
};
const generateRevenueReport = async (startDate, endDate) => {
    const whereClause = {};
    if (startDate && endDate) {
        whereClause.createdAt = {
            gte: new Date(startDate),
            lte: new Date(endDate),
        };
    }
    const payments = await client_1.default.payment.findMany({
        where: whereClause,
    });
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    return {
        type: 'revenue',
        totalRevenue,
        totalPayments: payments.length,
        data: payments,
    };
};
