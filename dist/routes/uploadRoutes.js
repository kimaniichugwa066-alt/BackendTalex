"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const upload_1 = __importDefault(require("../middleware/upload"));
const uploadController_1 = require("../controllers/uploadController");
const router = (0, express_1.Router)();
// Add CORS handling specifically for upload routes
const uploadCorsOptions = {
    origin: ['https://talex-one.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
};
router.use((0, cors_1.default)(uploadCorsOptions));
router.options('*', (0, cors_1.default)(uploadCorsOptions));
router.post('/', upload_1.default.single('resume'), uploadController_1.uploadDocument);
router.post('/upload-resume', upload_1.default.single('resume'), uploadController_1.uploadDocument);
router.get('/documents', uploadController_1.getUserDocuments);
exports.default = router;
