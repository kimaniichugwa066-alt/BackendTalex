"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_js_1 = __importDefault(require("../middleware/upload.js"));
const router = (0, express_1.Router)();
router.post("/upload-resume", upload_js_1.default.single("resume"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        res.json({
            success: true,
            fileUrl: req.file.path
        });
    }
    catch (error) {
        res.status(500).json({ message: "Upload failed" });
    }
});
exports.default = router;
