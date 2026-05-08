"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const config_1 = require("../config");
const apiResponse_1 = require("../utils/apiResponse");
const notificationService_1 = require("../services/notificationService");
const signToken = (userId, role) => jsonwebtoken_1.default.sign({ userId, role }, config_1.config.jwtSecret, { expiresIn: '7d' });
const register = async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const existing = await client_1.default.user.findFirst({ where: { OR: [{ email }, { phone }] } });
        if (existing) {
            return res.status(409).json((0, apiResponse_1.errorResponse)('Email or phone already in use'));
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await client_1.default.user.create({
            data: { name, email, phone, password: hashedPassword, role: 'USER' },
        });
        const token = signToken(user.id, user.role);
        // Send welcome email asynchronously
        (0, notificationService_1.sendWelcomeEmail)(user.email, user.name).catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Registration successful', { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to register user', error));
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await client_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json((0, apiResponse_1.errorResponse)('Invalid credentials'));
        }
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json((0, apiResponse_1.errorResponse)('Invalid credentials'));
        }
        const token = signToken(user.id, user.role);
        res.json((0, apiResponse_1.successResponse)('Login successful', { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Login failed', error));
    }
};
exports.login = login;
const refreshToken = async (_req, res) => {
    res.json((0, apiResponse_1.successResponse)('Refresh token endpoint. Implement token refresh on the client side.'));
};
exports.refreshToken = refreshToken;
const logout = async (_req, res) => {
    res.json((0, apiResponse_1.successResponse)('Logout successful'));
};
exports.logout = logout;
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await client_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('User not found'));
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await client_1.default.user.update({ where: { email }, data: { password: hashedPassword } });
        res.json((0, apiResponse_1.successResponse)('Password reset successful'));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Password reset failed', error));
    }
};
exports.resetPassword = resetPassword;
