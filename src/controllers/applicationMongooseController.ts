import { Request, Response } from 'express';
import Application from '../models/Application';
import User from '../models/User';
import Job from '../models/Job';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendEmail } from '../utils/sendEmail';

const formatResumeUrl = (url: string) => {
  if (!url) return url;
  // Add Cloudinary attachment parameter to enable downloads
  return url.replace('/upload/', '/upload/fl_attachment/');
};

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    // Only admins can view all applications
    if (req.user?.role !== 'admin') {
      return res.status(403).json(errorResponse('Only admins can view all applications'));
    }

    const applications = await Application.find()
      .populate('applicant', 'fullName email phone resume role')
      .populate('job', 'title company location salary description')
      .sort({ createdAt: -1 });

    // Format resume URLs for downloads
    const formattedApplications = applications.map((app: any) => ({
      ...app.toObject(),
      applicant: {
        ...((app.applicant as any).toObject ? app.applicant.toObject() : app.applicant),
        resume: formatResumeUrl((app.applicant as any).resume)
      }
    }));

    res.json(successResponse('All applications loaded', { applications: formattedApplications }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load applications', error));
  }
};

export const getUserApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const applications = await Application.find({ applicant: userId })
      .populate('applicant', 'fullName email phone resume')
      .populate('job', 'title company location salary description');

    // Format resume URLs for downloads
    const formattedApplications = applications.map((app: any) => ({
      ...app.toObject(),
      applicant: {
        ...((app.applicant as any).toObject ? app.applicant.toObject() : app.applicant),
        resume: formatResumeUrl((app.applicant as any).resume)
      }
    }));

    res.json(successResponse('User applications loaded', { applications: formattedApplications }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load applications', error));
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate('applicant', 'fullName email phone resume')
      .populate('job', 'title company location salary description');

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    // Check access permissions
    if (application.applicant.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json(errorResponse('Access denied'));
    }

    // Format resume URL for download
    const formattedApp = {
      ...application.toObject(),
      applicant: {
        ...((application.applicant as any).toObject ? application.applicant.toObject() : application.applicant),
        resume: formatResumeUrl((application.applicant as any).resume)
      }
    };

    res.json(successResponse('Application loaded', { application: formattedApp }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to load application', error));
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only admins can update application status
    if (req.user?.role !== 'admin') {
      return res.status(403).json(errorResponse('Only admins can update application status'));
    }

    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json(errorResponse('Invalid status. Must be one of: pending, reviewed, accepted, rejected'));
    }

    const application = await Application.findById(id)
      .populate('applicant', 'fullName email phone resume')
      .populate('job', 'title company location salary');

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    // Update status
    application.status = status;
    await application.save();

    const email = (application.applicant as any).email;
    const name = (application.applicant as any).fullName;
    const jobTitle = (application.job as any).title;
    const company = (application.job as any).company;

    // ✅ ACCEPTED EMAIL
    if (status === 'accepted') {
      await sendEmail({
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
      await sendEmail({
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

    res.json(successResponse(`Application ${status} and email sent`, { application }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update application status', error));
  }
};

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId, coverLetter } = req.body;
    const userId = req.user?.id;

    if (!jobId) {
      return res.status(400).json(errorResponse('Job ID is required'));
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json(errorResponse('Job not found'));
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      applicant: userId,
      job: jobId
    });

    if (existingApplication) {
      return res.status(409).json(errorResponse('You have already applied for this job'));
    }

    // Create application
    const application = new Application({
      applicant: userId,
      job: jobId,
      coverLetter,
      status: 'pending'
    });

    await application.save();

    // Populate before returning
    await application.populate('applicant', 'fullName email phone resume');
    await application.populate('job', 'title company location salary');

    res.status(201).json(successResponse('Application created successfully', { application }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to create application', error));
  }
};
