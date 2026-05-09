import { Router, Request, Response } from 'express';
import {
  createApplication,
  getUserApplications,
  getApplicationById,
  getAllApplications,
  updateApplicationStatus
} from '../controllers/applicationMongooseController';
import { authMiddleware, adminOnly } from '../middleware/authMiddleware';
import Application from '../models/Application';
import { createOfferLetter } from '../utils/generateOfferLetter';
import { AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Create application
router.post('/create', createApplication);

// Get all applications (admin only)
router.get('/all', authMiddleware, adminOnly, getAllApplications);

// Get user's applications
router.get('/user', authMiddleware, getUserApplications);

// Update application status (admin only) - with email notification
router.put('/:id/status', authMiddleware, adminOnly, updateApplicationStatus);

// Download offer letter PDF (admin only)
router.get('/:id/offer-letter', authMiddleware, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'fullName email phone resume')
      .populate('job', 'title company location salary description');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=offer-letter-${application._id}.pdf`
    );

    // Generate and stream PDF
    const doc = createOfferLetter(application as any);
    doc.pipe(res);

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single application
router.get('/:id', authMiddleware, getApplicationById);

export default router;
