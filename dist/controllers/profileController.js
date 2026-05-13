"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const apiResponse_1 = require("../utils/apiResponse");
const getProfile = async (req, res) => {
    try {
        const user = await client_1.default.user.findUnique({
            where: { id: req.user?.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                headline: true,
                location: true,
                summary: true,
                experience: true,
                education: true,
                linkedIn: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
                documents: {
                    select: {
                        id: true,
                        type: true,
                        url: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!user) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('Profile not found'));
        }
        res.json((0, apiResponse_1.successResponse)('Profile loaded', { profile: user }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load profile', error));
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const data = req.body;
        const user = await client_1.default.user.update({
            where: { id: req.user?.id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                headline: true,
                location: true,
                summary: true,
                experience: true,
                education: true,
                linkedIn: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json((0, apiResponse_1.successResponse)('Profile updated', { profile: user }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to update profile', error));
    }
};
exports.updateProfile = updateProfile;
