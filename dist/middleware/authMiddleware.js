"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const config_1 = require("../config");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        const payload = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        const user = await client_1.default.user.findUnique({ where: { id: payload.userId } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        req.user = { id: user.id, role: user.role };
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
