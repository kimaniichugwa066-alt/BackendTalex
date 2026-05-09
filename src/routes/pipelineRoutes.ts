import { Router } from 'express';
import {
  reviewApplication,
  scheduleInterview,
  sendOfferLetter,
  markHired,
  rejectApplication
} from '../controllers/pipelineController';
import { authMiddleware, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// All pipeline routes require authentication and admin role
router.use(authMiddleware, adminOnly);

// 🔄 Move application to under_review
router.put('/:id/review', reviewApplication);

// 📅 Schedule interview (requires date and link in body)
router.put('/:id/interview', scheduleInterview);

// 📄 Send offer letter
router.put('/:id/offer', sendOfferLetter);

// 🏁 Mark as hired
router.put('/:id/hire', markHired);

// ❌ Reject application
router.put('/:id/reject', rejectApplication);

export default router;
