import { Router } from 'express';
import { createApplication, getUserApplications, getApplicationById } from '../controllers/applicationController';
import { validateRequest } from '../middleware/validateRequest';
import { createApplicationSchema } from '../validators/applicationValidator';

const router = Router();

router.post('/create', validateRequest(createApplicationSchema), createApplication);
router.get('/user', getUserApplications);
router.get('/:id', getApplicationById);

export default router;
