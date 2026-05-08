import { Router } from 'express';
import { generateReport } from '../controllers/reportController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { z } from 'zod';

const reportSchema = z.object({
  body: z.object({
    type: z.enum(['applications', 'jobs', 'users', 'revenue']),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

const router = Router();

router.use(authMiddleware, adminMiddleware);
router.post('/', validateRequest(reportSchema), generateReport);

export default router;