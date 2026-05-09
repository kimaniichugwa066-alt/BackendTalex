"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = require("../utils/generateToken");
const apiResponse_1 = require("../utils/apiResponse");
// ✅ REGISTER
const register = async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;
        // Validate required fields
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json((0, apiResponse_1.errorResponse)('Please provide all required fields'));
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(409).json((0, apiResponse_1.errorResponse)('Email or phone already in use'));
        }
        // Create user
        const user = await User_1.default.create({
            fullName,
            email,
            phone,
            password,
            role: role || 'user',
        });
        // Generate token
        const token = (0, generateToken_1.generateToken)(user);
        res.status(201).json((0, apiResponse_1.successResponse)('User created successfully', {
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        }));
    }
    catch (err) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Register failed', err.message));
    }
};
exports.register = register;
// ✅ LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json((0, apiResponse_1.errorResponse)('Please provide email and password'));
        }
        // Find user
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json((0, apiResponse_1.errorResponse)('User not found'));
        }
        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json((0, apiResponse_1.errorResponse)('Invalid password'));
        }
        // Generate token
        const token = (0, generateToken_1.generateToken)(user);
        res.json((0, apiResponse_1.successResponse)('Login successful', {
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        }));
    }
    catch (err) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Login failed', err.message));
    }
};
exports.login = login;
// ✅ GET CURRENT USER
const getCurrentUser = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?.id).select('-password');
        if (!user) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('User not found'));
        }
        res.json((0, apiResponse_1.successResponse)('User loaded', { user }));
    }
    catch (err) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load user', err.message));
    }
};
exports.getCurrentUser = getCurrentUser;
