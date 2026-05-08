import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { validateRequest } from '../middleware/validateRequest';
import { updateProfileSchema } from '../validators/profileValidator';

const router = Router();

router.get('/', getProfile);
router.put('/', validateRequest(updateProfileSchema), updateProfile);

export default router;