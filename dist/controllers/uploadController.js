"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const fs_1 = __importDefault(require("fs"));
const apiResponse_1 = require("../utils/apiResponse");
const config_1 = require("../config");
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
    try {
        const result = await cloudinary_1.default.v2.uploader.upload(file.path, {
            resource_type: 'auto',
            folder: 'backendtalex',
        });
        fs_1.default.unlinkSync(file.path);
        res.json((0, apiResponse_1.successResponse)('Document uploaded', { url: result.secure_url, type }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Upload failed', error));
    }
};
exports.uploadDocument = uploadDocument;
