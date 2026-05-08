"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
