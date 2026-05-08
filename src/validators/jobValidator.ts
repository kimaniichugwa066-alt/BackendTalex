import { z } from 'zod';

const jobPayload = z.object({
  title: z.string().min(3),
  company: z.string().min(2),
  description: z.string().min(10),
  requirements: z.string().min(10),
  benefits: z.string().optional(),
  salary: z.string().optional(),
  province: z.string().min(2),
  visaSponsored: z.boolean().optional().default(false),
  deadline: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Invalid deadline format',
  }),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const jobSchema = z.object({
  body: jobPayload,
  params: z.object({}),
  query: z.object({}),
});

export const updateJobSchema = z.object({
  body: jobPayload.partial(),
  params: z.object({ id: z.string().uuid() }),
  query: z.object({}),
});

export const updateApplicationStatusSchema = z.object({
  body: z.object({
    applicationId: z.string().uuid(),
    status: z.enum(['SUBMITTED', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW', 'APPROVED', 'REJECTED']),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const replySupportRequestSchema = z.object({
  body: z.object({
    requestId: z.string().uuid(),
    reply: z.string().min(10),
  }),
  params: z.object({}),
  query: z.object({}),
});
