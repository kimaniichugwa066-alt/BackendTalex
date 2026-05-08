"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getNotifications = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const apiResponse_1 = require("../utils/apiResponse");
const getNotifications = async (req, res) => {
    try {
        const notifications = await client_1.default.notification.findMany({
            where: { userId: req.user?.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json((0, apiResponse_1.successResponse)('Notifications loaded', { notifications }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load notifications', error));
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await client_1.default.notification.findUnique({ where: { id } });
        if (!notification || notification.userId !== req.user?.id) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('Notification not found'));
        }
        const updated = await client_1.default.notification.update({
            where: { id },
            data: { isRead: true },
        });
        res.json((0, apiResponse_1.successResponse)('Notification marked read', { notification: updated }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to mark as read', error));
    }
};
exports.markAsRead = markAsRead;
