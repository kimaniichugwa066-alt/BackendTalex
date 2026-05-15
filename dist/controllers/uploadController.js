"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDocuments = exports.uploadDocument = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const client_1 = __importDefault(require("../prisma/client"));
const config_1 = require("../config");
const apiResponse_1 = require("../utils/apiResponse");
cloudinary_1.default.v2.config({
    cloud_name: config_1.config.cloudinary.cloudName,
    api_key: config_1.config.cloudinary.apiKey,
    api_secret: config_1.config.cloudinary.apiSecret,
});
const uploadDocument = async (req, res) => {
    const { type } = req.body;
    const file = req.file;
    if (!file) {
        return res.status(400).json((0, apiResponse_1.errorResponse)('File is required'));
    }
    if (!req.user) {
        return res.status(401).json((0, apiResponse_1.errorResponse)('Unauthorized'));
    }
    try {
        // For multer-storage-cloudinary, the file may have secure_url, url, path, or filename
        const fileAny = file;
        let fileUrl = fileAny.secure_url || fileAny.url || file.path || file.filename;
        if (!fileUrl) {
            return res.status(500).json((0, apiResponse_1.errorResponse)('Failed to get uploaded file URL'));
        }
        const document = await client_1.default.document.create({
            data: {
                userId: req.user.id,
                type: type || 'CV',
                url: fileUrl,
            },
        });
        res.json((0, apiResponse_1.successResponse)('Document uploaded', { document }));
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json((0, apiResponse_1.errorResponse)('Upload failed', error));
    }
};
exports.uploadDocument = uploadDocument;
const getUserDocuments = async (req, res) => {
    if (!req.user) {
        return res.status(401).json((0, apiResponse_1.errorResponse)('Unauthorized'));
    }
    try {
        const documents = await client_1.default.document.findMany({
            where: { userId: req.user.id },
            select: { id: true, type: true, url: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json((0, apiResponse_1.successResponse)('Documents loaded', { documents }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load documents', error));
    }
};
exports.getUserDocuments = getUserDocuments;
