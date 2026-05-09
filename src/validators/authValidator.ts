import { z } from 'zod';

// Allow international phone format: with optional +, 10-15 digits
const internationalPhoneRegex = /^\+?\d{10,15}$/;

// Better email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password: minimum 8 characters, at least one uppercase, one number, one special char
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().regex(emailRegex, 'Invalid email format'),
    phone: z.string().regex(internationalPhoneRegex, 'Invalid phone number. Use format: +[country code][number] or [10-15 digits]').optional(),
    phoneNumber: z.string().regex(internationalPhoneRegex, 'Invalid phone number. Use format: +[country code][number] or [10-15 digits]').optional(),
    password: z.string().regex(passwordRegex, 'Password must be at least 8 characters with uppercase, number, and special character'),
  }).refine((data) => data.phone || data.phoneNumber, {
    message: "Either phone or phoneNumber is required",
    path: ["phone"],
  }),
  params: z.object({}),
  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().regex(emailRegex, 'Invalid email format'),
    password: z.string().min(8),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().regex(emailRegex, 'Invalid email format'),
    newPassword: z.string().regex(passwordRegex, 'Password must be at least 8 characters with uppercase, number, and special character'),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().regex(emailRegex, 'Invalid email format'),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const resetPasswordWithTokenSchema = z.object({
  body: z.object({
    token: z.string(),
    newPassword: z.string().regex(passwordRegex, 'Password must be at least 8 characters with uppercase, number, and special character'),
  }),
  params: z.object({}),
  query: z.object({}),
});
