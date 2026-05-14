import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().uuid(),
    paymentId: z.string().uuid(),
    coverLetter: z.string().min(20, 'Cover letter is required and must be at least 20 characters'),
  }),
  params: z.object({}),
  query: z.object({}),
});
