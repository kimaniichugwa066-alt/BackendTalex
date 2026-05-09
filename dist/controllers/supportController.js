"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSupportRequests = exports.createSupportRequest = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const apiResponse_1 = require("../utils/apiResponse");
const config_1 = require("../config");
const notificationService_1 = require("../services/notificationService");
const supportEmail = config_1.config.supportEmail || config_1.config.brevo.senderEmail || config_1.config.email.user;
const createSupportRequest = async (req, res) => {
    const { category, subject, message } = req.body;
    try {
        const supportRequest = await client_1.default.supportRequest.create({
            data: {
                userId: req.user?.id,
                category,
                subject,
                message,
            },
        });
        const html = `
      <h1>Support Request</h1>
      <p><strong>User:</strong> ${req.user?.id}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `;
        (0, notificationService_1.sendEmail)({
            to: supportEmail,
            subject: `Support Request: ${subject}`,
            html,
        }).catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Support request submitted', { supportRequest }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to submit support request', error));
    }
};
exports.createSupportRequest = createSupportRequest;
const getUserSupportRequests = async (req, res) => {
    try {
        const requests = await client_1.default.supportRequest.findMany({
            where: { userId: req.user?.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json((0, apiResponse_1.successResponse)('Support requests loaded', { requests }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load support requests', error));
    }
};
exports.getUserSupportRequests = getUserSupportRequests;
