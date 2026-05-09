"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMongooseController_1 = require("../controllers/authMongooseController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = __importDefault(require("../middleware/upload"));
const router = (0, express_1.Router)();
// Register with resume upload
router.post('/register', upload_1.default.single('resume'), authMongooseController_1.register);
// Login
router.post('/login', authMongooseController_1.login);
// Get current user (protected)
router.get('/me', authMiddleware_1.authMiddleware, authMongooseController_1.getCurrentUser);
exports.default = router;
