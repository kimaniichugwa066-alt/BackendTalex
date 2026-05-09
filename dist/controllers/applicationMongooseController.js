"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplication = exports.updateApplicationStatus = exports.getApplicationById = exports.getUserApplications = exports.getAllApplications = void 0;
const Application_1 = __importDefault(require("../models/Application"));
const Job_1 = __importDefault(require("../models/Job"));
const apiResponse_1 = require("../utils/apiResponse");
const sendEmail_1 = require("../utils/sendEmail");
const formatResumeUrl = (url) => {
    if (!url)
        return url;
    // Add Cloudinary attachment parameter to enable downloads
    return url.replace('/upload/', '/upload/fl_attachment/');
};
const getAllApplications = async (req, res) => {
    try {
        // Only admins can view all applications
        if (req.user?.role !== 'admin') {
            return res.status(403).json((0, apiResponse_1.errorResponse)('Only admins can view all applications'));
        }
        const applications = await Application_1.default.find()
            .populate('applicant', 'fullName email phone resume role')
            .populate('job', 'title company location salary description')
            .sort({ createdAt: -1 });
        // Format resume URLs for downloads
        const formattedApplications = applications.map((app) => ({
            ...app.toObject(),
            applicant: {
                ...(app.applicant.toObject ? app.applicant.toObject() : app.applicant),
                resume: formatResumeUrl(app.applicant.resume)
            }
        }));
        res.json((0, apiResponse_1.successResponse)('All applications loaded', { applications: formattedApplications }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load applications', error));
    }
};
exports.getAllApplications = getAllApplications;
const getUserApplications = async (req, res) => {
    try {
        const userId = req.user?.id;
        const applications = await Application_1.default.find({ applicant: userId })
            .populate('applicant', 'fullName email phone resume')
            .populate('job', 'title company location salary description');
        // Format resume URLs for downloads
        const formattedApplications = applications.map((app) => ({
            ...app.toObject(),
            applicant: {
                ...(app.applicant.toObject ? app.applicant.toObject() : app.applicant),
                resume: formatResumeUrl(app.applicant.resume)
            }
        }));
        res.json((0, apiResponse_1.successResponse)('User applications loaded', { applications: formattedApplications }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load applications', error));
    }
};
exports.getUserApplications = getUserApplications;
const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application_1.default.findById(id)
            .populate('applicant', 'fullName email phone resume')
            .populate('job', 'title company location salary description');
        if (!application) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('Application not found'));
        }
        // Check access permissions
        if (application.applicant.toString() !== req.user?.id && req.user?.role !== 'admin') {
            return res.status(403).json((0, apiResponse_1.errorResponse)('Access denied'));
        }
        // Format resume URL for download
        const applicant = application.applicant;
        const applicantData = applicant?.toObject ? applicant.toObject() : applicant;
        const formattedApp = {
            ...application.toObject(),
            applicant: {
                ...applicantData,
                resume: formatResumeUrl(applicant?.resume)
            }
        };
        res.json((0, apiResponse_1.successResponse)('Application loaded', { application: formattedApp }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to load application', error));
    }
};
exports.getApplicationById = getApplicationById;
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Only admins can update application status
        if (req.user?.role !== 'admin') {
            return res.status(403).json((0, apiResponse_1.errorResponse)('Only admins can update application status'));
        }
        if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json((0, apiResponse_1.errorResponse)('Invalid status. Must be one of: pending, reviewed, accepted, rejected'));
        }
        const application = await Application_1.default.findById(id)
            .populate('applicant', 'fullName email phone resume')
            .populate('job', 'title company location salary');
        if (!application) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('Application not found'));
        }
        // Update status
        application.status = status;
        await application.save();
        const email = application.applicant.email;
        const name = application.applicant.fullName;
        const jobTitle = application.job.title;
        const company = application.job.company;
        // ✅ ACCEPTED EMAIL
        if (status === 'accepted') {
            await (0, sendEmail_1.sendEmail)({
                to: email,
                subject: '🎉 Application Accepted - Talex',
                html: `
          <h2>Congratulations ${name}! 🎉</h2>
          <p>We have <b>accepted</b> your application for:</p>
          <h3>${jobTitle} at ${company}</h3>
          <p>We will contact you soon with the next steps.</p>
          <p>Thank you for your interest in Talex!</p>
        `,
            }).catch(console.error);
        }
        // ❌ REJECTED EMAIL
        if (status === 'rejected') {
            await (0, sendEmail_1.sendEmail)({
                to: email,
                subject: 'Application Update - Talex',
                html: `
          <h2>Hello ${name}</h2>
          <p>Thank you for applying for:</p>
          <h3>${jobTitle} at ${company}</h3>
          <p>Unfortunately, you were not selected this time.</p>
          <p>We encourage you to apply for other roles and check back soon for more opportunities.</p>
          <p>Best regards,<br>Talex Team</p>
        `,
            }).catch(console.error);
        }
        res.json((0, apiResponse_1.successResponse)(`Application ${status} and email sent`, { application }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to update application status', error));
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
const createApplication = async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;
        const userId = req.user?.id;
        if (!jobId) {
            return res.status(400).json((0, apiResponse_1.errorResponse)('Job ID is required'));
        }
        // Check if job exists
        const job = await Job_1.default.findById(jobId);
        if (!job) {
            return res.status(404).json((0, apiResponse_1.errorResponse)('Job not found'));
        }
        // Check if user already applied
        const existingApplication = await Application_1.default.findOne({
            applicant: userId,
            job: jobId
        });
        if (existingApplication) {
            return res.status(409).json((0, apiResponse_1.errorResponse)('You have already applied for this job'));
        }
        // Create application
        const application = new Application_1.default({
            applicant: userId,
            job: jobId,
            coverLetter,
            status: 'pending'
        });
        await application.save();
        // Populate before returning
        await application.populate('applicant', 'fullName email phone resume');
        await application.populate('job', 'title company location salary');
        res.status(201).json((0, apiResponse_1.successResponse)('Application created successfully', { application }));
    }
    catch (error) {
        res.status(500).json((0, apiResponse_1.errorResponse)('Failed to create application', error));
    }
};
exports.createApplication = createApplication;
