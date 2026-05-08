import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import {
  createJob,
  updateJob,
  deleteJob,
  getAllApplications,
  updateApplicationStatus,
  getAllUsers,
  getAllPayments,
  getDashboardStats,
} from '../controllers/adminController';
import { validateRequest } from '../middleware/validateRequest';
import { jobSchema, updateJobSchema, updateApplicationStatusSchema } from '../validators/jobValidator';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.post('/jobs/create', validateRequest(jobSchema), createJob);
router.put('/jobs/update/:id', validateRequest(updateJobSchema), updateJob);
router.delete('/jobs/delete/:id', deleteJob);
router.get('/applications', getAllApplications);
router.patch('/applications/update-status', validateRequest(updateApplicationStatusSchema), updateApplicationStatus);
router.get('/users', getAllUsers);
router.get('/payments', getAllPayments);
router.get('/dashboard', getDashboardStats);

export default router;
