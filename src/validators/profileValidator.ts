import { z } from 'zod';

// Allow international phone format: with optional +, 10-15 digits
const internationalPhoneRegex = /^\+?\d{10,15}$/;

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().regex(internationalPhoneRegex, 'Invalid phone number. Use format: +[country code][number] or [10-15 digits]').optional(),
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