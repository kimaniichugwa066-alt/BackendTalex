# Talex Backend Guide

This guide explains how to set up the Talex backend API server for the Canadian jobs marketplace.

## Overview

Talex connects Kenyan job seekers with Canadian employment opportunities. The frontend is built in Next.js and expects a REST API for authentication, jobs, applications, profile management, payments, and admin workflows.

This repository contains the backend scaffold for Talex using Node.js, Express, TypeScript, and PostgreSQL.

## Features

- Express + TypeScript API
- JWT auth with user/admin roles
- Prisma + PostgreSQL data models
- M-Pesa STK push payment flow
- Cloudinary document uploads
- Admin job management and reporting
- Validation with Zod
- Security with Helmet, CORS, and rate limiting
- **Email & SMS notifications**
- **Redis caching for performance**
- **Background cron jobs for cleanup and reminders**

## Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Language: TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT
- Validation: Zod
- Payment flow: M-Pesa Daraja API
- File storage: Cloudinary
- Email: Nodemailer
- Security: Helmet, CORS, rate limiting

## Project Structure

```
/BackendTalex
 ├── server
 │   ├── src
 │   │   ├── config
 │   │   ├── controllers
 │   │   ├── routes
 │   │   ├── middleware
 │   │   ├── validators
 │   │   ├── prisma
 │   │   ├── utils
 │   │   ├── app.ts
 │   │   └── server.ts
 ├── prisma
 │   └── schema.prisma
 ├── .env.example
 ├── package.json
 └── BACKEND_GUIDE.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register`
  - Body: `{ name, email, phone, password }`
  - Response: `{ success, message, data: { token, user } }`
- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Response: `{ success, message, data: { token, user } }`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/reset-password`
  - Body: `{ email, newPassword }`

### Jobs

- `GET /api/jobs`
  - Returns active jobs
- `GET /api/jobs/search?q=...&province=...&visaSponsored=...`
- `GET /api/jobs/:id`

### User Profile & Applications

- `GET /api/applications/user`
  - Headers: `Authorization: Bearer <token>`
- `POST /api/applications/create`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ jobId, paymentId }`
- `GET /api/applications/:id`
  - Headers: `Authorization: Bearer <token>`

### Payments

- `POST /api/payments/stkpush`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ phone, amount, jobId }`
- `POST /api/payments/callback`
  - M-Pesa callback endpoint
- `POST /api/payments/verify`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ paymentId }`

### Uploads

- `POST /api/upload`
  - Headers: `Authorization: Bearer <token>`
  - Form field: `file`

### Notifications

- `GET /api/notifications`
- `PATCH /api/notifications/read/:id`

### Admin

- `POST /api/admin/jobs/create`
- `PUT /api/admin/jobs/update/:id`
- `DELETE /api/admin/jobs/delete/:id`
- `GET /api/admin/applications`
- `PATCH /api/admin/applications/update-status`
- `GET /api/admin/users`
- `GET /api/admin/payments`
- `GET /api/admin/dashboard`

## Database Models

The current database schema includes:

- `User`
- `Job`
- `Application`
- `Payment`
- `Document`
- `Notification`

The application flow enforces `NO PAYMENT = NO APPLICATION`, with a fixed Ksh 500 fee.

## Environment Variables

Use `.env` with values copied from `.env.example`.

Required variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `REDIS_URL`
- `PORT`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Run database migration:

```bash
npx prisma migrate dev --name init
```

4. Copy `.env.example` to `.env` and configure values.

5. Start the development server:

```bash
npm run dev
```

## Frontend Integration

Update the Talex frontend service layer to use the backend endpoints instead of mock data. For example:

```ts
import { api } from '@/lib/api';

export const jobService = {
  list: async () => {
    const response = await api.get('/jobs');
    return response.data.data.jobs;
  },
  findById: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data.data.job;
  },
};
```

Use `Authorization: Bearer <token>` for protected routes.

## Deployment

- Deploy backend to Railway, Heroku, or another Node host.
- Deploy frontend to Vercel.
- Set the backend URL in the frontend config.

## Security Notes

- Use HTTPS in production.
- Rate limit public APIs.
- Hash passwords with bcrypt.
- Validate all request data with Zod.
- Keep secrets in environment variables.

## Useful Additions

- Add email notifications for registration and application updates.
- Add SMS notifications for key workflows.
- Add Redis caching for frequently requested job listings.
- Add background tasks to expire old jobs and clean up stale records.
## New Features Added

### Email & SMS Notifications

The backend now sends automated notifications:

- **Welcome emails** when users register
- **Application submitted emails** with tracking numbers
- **Status update emails** when applications change status
- **Payment reminder SMS** for pending applications

Configure email settings in `.env`:
```
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
```

Configure SMS settings for Africa's Talking:
```
SMS_API_KEY=your-api-key
SMS_USERNAME=your-username
```

### Redis Caching

Frequently accessed data is cached in Redis for better performance:

- Job listings (5-minute cache)
- Individual job details (10-minute cache)
- Admin dashboard statistics (5-minute cache)

Cache is automatically invalidated when data changes.

### Background Cron Jobs

Automated maintenance tasks run on schedules:

- **Every hour**: Expire unpaid applications after 24 hours
- **Every 6 hours**: Send payment reminders via SMS
- **Daily at midnight**: Deactivate expired jobs
- **Daily at 2 AM**: Clean notifications older than 30 days

Jobs use `node-cron` and run automatically when the server starts.
