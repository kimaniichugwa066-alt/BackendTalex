import { z } from 'zod';

export const stkPushSchema = z.object({
  body: z.object({
    phone: z.string().min(9),
    amount: z.number().int().positive(),
    jobId: z.string().uuid(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    paymentId: z.string().uuid(),
  }),
  params: z.object({}),
  query: z.object({}),
});
