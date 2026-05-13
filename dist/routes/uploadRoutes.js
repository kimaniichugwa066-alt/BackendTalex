"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = __importDefault(require("../middleware/upload"));
const uploadController_1 = require("../controllers/uploadController");
const router = (0, express_1.Router)();
router.post('/', upload_1.default.single('resume'), uploadController_1.uploadDocument);
router.post('/upload-resume', upload_1.default.single('resume'), uploadController_1.uploadDocument);
router.get('/documents', uploadController_1.getUserDocuments);
exports.default = router;
