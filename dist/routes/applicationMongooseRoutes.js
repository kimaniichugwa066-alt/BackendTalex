"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicationMongooseController_1 = require("../controllers/applicationMongooseController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const Application_1 = __importDefault(require("../models/Application"));
const generateOfferLetter_1 = require("../utils/generateOfferLetter");
const router = (0, express_1.Router)();
// Create application
router.post('/create', applicationMongooseController_1.createApplication);
// Get all applications (admin only)
router.get('/all', authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, applicationMongooseController_1.getAllApplications);
// Get user's applications
router.get('/user', authMiddleware_1.authMiddleware, applicationMongooseController_1.getUserApplications);
// Update application status (admin only) - with email notification
router.put('/:id/status', authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, applicationMongooseController_1.updateApplicationStatus);
// Download offer letter PDF (admin only)
router.get('/:id/offer-letter', authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, async (req, res) => {
    try {
        const application = await Application_1.default.findById(req.params.id)
            .populate('applicant', 'fullName email phone resume')
            .populate('job', 'title company location salary description');
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=offer-letter-${application._id}.pdf`);
        // Generate and stream PDF
        const doc = (0, generateOfferLetter_1.createOfferLetter)(application);
        doc.pipe(res);
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// Get single application
router.get('/:id', authMiddleware_1.authMiddleware, applicationMongooseController_1.getApplicationById);
exports.default = router;
