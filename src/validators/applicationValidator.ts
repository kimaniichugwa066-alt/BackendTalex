import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().uuid(),
    paymentId: z.string().uuid(),
  }),
  params: z.object({}),
  query: z.object({}),
});
