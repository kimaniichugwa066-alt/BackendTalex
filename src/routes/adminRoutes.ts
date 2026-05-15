import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import {
  createJob,
  updateJob,
  deleteJob,
  getAllApplications,
  updateApplicationStatus,
  getAllSupportRequests,
  replySupportRequest,
  getAllUsers,
  getUserById,
  banUser,
  resetUserPassword,
  updateUser,
  getAllPayments,
  getDashboardStats,
} from '../controllers/adminController';
import { validateRequest } from '../middleware/validateRequest';
import { jobSchema, updateJobSchema, updateApplicationStatusSchema, replySupportRequestSchema } from '../validators/jobValidator';
import { adminBanUserSchema, adminResetPasswordSchema, adminUpdateUserSchema } from '../validators/adminValidator';

const router = Router();

router.use(adminMiddleware);

router.post('/jobs/create', validateRequest(jobSchema), createJob);
router.post('/jobs', validateRequest(jobSchema), createJob);
router.put('/jobs/update/:id', validateRequest(updateJobSchema), updateJob);
router.delete('/jobs/delete/:id', deleteJob);
router.get('/applications', getAllApplications);
router.patch('/applications/update-status', validateRequest(updateApplicationStatusSchema), updateApplicationStatus);
router.get('/support-requests', getAllSupportRequests);
router.patch('/support-requests/reply', validateRequest(replySupportRequestSchema), replySupportRequest);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/ban', validateRequest(adminBanUserSchema), banUser);
router.post('/users/:id/ban', validateRequest(adminBanUserSchema), banUser);
router.patch('/users/:id/password', validateRequest(adminResetPasswordSchema), resetUserPassword);
router.post('/users/:id/password', validateRequest(adminResetPasswordSchema), resetUserPassword);
router.patch('/users/:id', validateRequest(adminUpdateUserSchema), updateUser);
router.get('/payments', getAllPayments);
router.get('/dashboard', getDashboardStats);

export default router;
