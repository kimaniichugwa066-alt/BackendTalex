import { z } from 'zod';

export const supportRequestSchema = z.object({
  body: z.object({
    category: z.enum(['TECHNICAL', 'PAYMENT', 'JOB_POSTING', 'OTHER']),
    subject: z.string().min(3),
    message: z.string().min(10),
  }),
  params: z.object({}),
  query: z.object({}),
});