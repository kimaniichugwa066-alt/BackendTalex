import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { scheduleInterviewSchema } from '../validators/pipelineValidator';
import {
  reviewApplication,
  scheduleInterview,
  sendOffer,
  markHired,
  rejectApplication,
} from '../controllers/pipelineController';

const router = Router();

router.use(adminMiddleware);

router.put('/:id/review', reviewApplication);
router.put('/:id/interview', validateRequest(scheduleInterviewSchema), scheduleInterview);
router.put('/:id/offer', sendOffer);
router.put('/:id/hire', markHired);
router.put('/:id/reject', rejectApplication);

export default router;
