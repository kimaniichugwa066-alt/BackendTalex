import { Router } from 'express';
import { createSupportRequest, getUserSupportRequests } from '../controllers/supportController';
import { validateRequest } from '../middleware/validateRequest';
import { supportRequestSchema } from '../validators/supportValidator';

const router = Router();

router.post('/', validateRequest(supportRequestSchema), createSupportRequest);
router.get('/', getUserSupportRequests);

export default router;