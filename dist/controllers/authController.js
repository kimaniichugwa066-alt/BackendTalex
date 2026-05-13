"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.resetPassword = exports.forgotPassword = exports.testEmail = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const config_1 = require("../config");
const apiResponse_1 = require("../utils/apiResponse");
const notificationService_1 = require("../services/notificationService");
const signToken = (userId, role) => jsonwebtoken_1.default.sign({ userId, role }, config_1.config.jwtSecret, { expiresIn: '7d' });
const register = async (req, res) => {
    console.log("REGISTER BODY:", { ...req.body, password: "***" }); // Mask password for security
    const { name, email, phone, phoneNumber, password } = req.body;
    // Support both phone and phoneNumber for backward compatibility
    const phoneValue = (phone || phoneNumber || '').trim();
    try {
        const whereConditions = [{ email }];
        if (phoneValue) {
            whereConditions.push({ phone: phoneValue });
        }
        const existing = await client_1.default.user.findFirst({ where: { OR: whereConditions } });
        if (existing) {
            return res.status(409).json((0, apiResponse_1.errorResponse)('Email or phone already in use'));
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const verificationToken = jsonwebtoken_1.default.sign({ email }, config_1.config.jwtSecret, { expiresIn: '24h' });
        const userData = {
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword,
            role: 'USER',
            verificationToken,
        };
        if (phoneValue) {
            userData.phone = phoneValue;
        }
        const user = await client_1.default.user.create({
            data: userData,
        });
        const token = signToken(user.id, user.role);
        // Send verification email asynchronously
        (0, notificationService_1.sendVerificationEmail)(user.email, user.name, verificationToken).catch(console.error);
        return res.json((0, apiResponse_1.successResponse)('Registration successful. Please check your email to verify your account.', { token, role: user.role, user: { id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified } }));
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Registration failed',
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await client_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password',
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password',
            });
        }
        if (user.isBanned) {
            return res.status(403).json((0, apiResponse_1.errorResponse)('Your account has been banned. Please contact support.'));
        }
        if (!user.isVerified && user.role !== 'ADMIN') {
            return res.status(403).json((0, apiResponse_1.errorResponse)('Please verify your email before logging in'));
        }
        const token = signToken(user.id, user.role);
        return res.json((0, apiResponse_1.successResponse)('Login successful', { token, role: user.role, user: { id: user.id, name: user.name, email: user.email, role: user.role } }));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Server error',
        });
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
const testEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json((0, apiResponse_1.errorResponse)('Email is required to send a test email'));
    }
    try {
        const response = await (0, notificationService_1.sendEmail)({
            to: email,
            subject: 'Talex Brevo Email Test',
            html: '<h1>Talex Brevo Email Test</h1><p>This is a test email sent from BackendTalex.</p>',
            textContent: 'This is a test email sent from BackendTalex.',
        });
        return res.json((0, apiResponse_1.successResponse)('Test email sent successfully', response));
    }
    catch (error) {
        return res.status(500).json((0, apiResponse_1.errorResponse)('Failed to send test email', error));
    }
};
exports.testEmail = testEmail;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await client_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('User not found'));
        }
        const resetToken = jsonwebtoken_1.default.sign({ email }, config_1.config.jwtSecret, { expiresIn: '1h' });
        await client_1.default.user.update({
            where: { email },
            data: { resetToken },
        });
        // Send password reset email asynchronously
        (0, notificationService_1.sendPasswordResetEmail)(user.email, user.name, resetToken).catch(console.error);
        res.json((0, apiResponse_1.successResponse)('Password reset email sent. Please check your email.'));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to send password reset email', error));
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        const user = await client_1.default.user.findUnique({ where: { email: decoded.email } });
        if (!user) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('User not found'));
        }
        if (user.resetToken !== token) {
            return res.status(400).json((0, apiResponse_1.errorResponse)('Invalid reset token'));
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await client_1.default.user.update({
            where: { email: decoded.email },
            data: { password: hashedPassword, resetToken: null },
        });
        res.json((0, apiResponse_1.successResponse)('Password reset successful'));
    }
    catch (error) {
        res.status(400).json((0, apiResponse_1.errorResponse)('Invalid or expired reset token'));
    }
};
exports.resetPassword = resetPassword;
const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        const user = await client_1.default.user.findUnique({ where: { email: decoded.email } });
        if (!user) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('User not found'));
        }
        if (user.isVerified) {
            return res.status(400).json((0, apiResponse_1.errorResponse)('Email already verified'));
        }
        if (user.verificationToken !== token) {
            return res.status(400).json((0, apiResponse_1.errorResponse)('Invalid verification token'));
        }
        await client_1.default.user.update({
            where: { email: decoded.email },
            data: { isVerified: true, verificationToken: null },
        });
        // Send welcome email after successful verification
        (0, notificationService_1.sendWelcomeEmail)(user.email, user.name).catch(console.error);
        if (config_1.config.urls.frontend) {
            return res.redirect(`${config_1.config.urls.frontend}/login?verified=true`);
        }
        return res.json((0, apiResponse_1.successResponse)('Email verified successfully'));
    }
    catch (error) {
        res.status(400).json((0, apiResponse_1.errorResponse)('Invalid or expired verification token'));
    }
};
exports.verifyEmail = verifyEmail;
