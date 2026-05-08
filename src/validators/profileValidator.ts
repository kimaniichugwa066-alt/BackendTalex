import { z } from 'zod';

const kenyaPhoneRegex = /^(?:\+254|0)7\d{8}$/;

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().regex(kenyaPhoneRegex, 'Invalid Kenyan phone number').optional(),
    headline: z.string().max(120).optional(),
    location: z.string().max(100).optional(),
    summary: z.string().max(1000).optional(),
    experience: z.string().max(1000).optional(),
    education: z.string().max(1000).optional(),
    linkedIn: z.string().url().optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});