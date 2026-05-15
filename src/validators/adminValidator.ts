import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const internationalPhoneRegex = /^\+?\d{10,15}$/;

export const adminBanUserSchema = z.object({
  body: z.object({
    ban: z.boolean(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const adminResetPasswordSchema = z.object({
  body: z.object({
    newPassword: z.string().regex(passwordRegex, 'Password must be at least 8 characters with uppercase, number, and special character').optional(),
    password: z.string().regex(passwordRegex, 'Password must be at least 8 characters with uppercase, number, and special character').optional(),
  }).refine((data) => data.newPassword || data.password, {
    message: 'Password is required',
    path: ['newPassword'],
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const adminUpdateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().regex(internationalPhoneRegex, 'Invalid phone number format').optional(),
    headline: z.string().max(255).optional(),
    location: z.string().max(255).optional(),
    summary: z.string().optional(),
    experience: z.string().optional(),
    education: z.string().optional(),
    linkedIn: z.string().url().optional(),
  }).partial(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});
