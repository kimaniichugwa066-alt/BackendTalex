import { Router } from 'express';
import { getJobs, getJobById, searchJobs } from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { createJob } from '../controllers/adminController';
import { validateRequest } from '../middleware/validateRequest';
import { jobSchema } from '../validators/jobValidator';

const router = Router();

router.post('/', authMiddleware, adminMiddleware, validateRequest(jobSchema), createJob);
router.get('/search', searchJobs);
router.get('/', getJobs);
router.get('/:id', getJobById);

export default router;
