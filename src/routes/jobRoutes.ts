import { Router } from 'express';
import { getJobs, getJobById, searchJobs } from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/search', searchJobs);
router.get('/', getJobs);
router.get('/:id', getJobById);

export default router;
