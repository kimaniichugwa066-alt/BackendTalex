# BackendTalex

A backend scaffold for the Canada Jobs Application Platform.

## Features

- Express + TypeScript API
- JWT auth with user/admin roles
- Prisma + PostgreSQL data models
- M-Pesa STK push payment flow
- Cloudinary document uploads
- Admin job management and reporting
- Job search and matching tailored for Kenyan applicants
- User registration with Kenyan phone number support
- Profile management and resume updates
- Contact support and issue reporting workflows
- Validation with Zod
- Security with Helmet, CORS, and rate limiting
- **Email & SMS notifications**
- **Redis caching for performance**
- **Background cron jobs for cleanup and reminders**

## Project Structure

- `src` — application source code
- `prisma/schema.prisma` — database schema
- `.env.example` — environment variables template

## Database Setup

The project is configured to use **Neon PostgreSQL** database. The connection string is already set in `.env`:

```env
DATABASE_URL=postgresql://neondb_owner:npg_yZhFQgbPc50I@ep-sweet-water-aph1j617.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Initialize Database

1. Generate Prisma client:

```bash
npm run prisma:generate
```

2. Run database migration:

```bash
npm run prisma:migrate
```

3. Create admin user for testing:

```bash
npm run create-admin
```

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Database is already configured in `.env`

3. Initialize database:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run create-admin
```

4. Test database connection:

```bash
npm run test-db
```

5. Run in development:

```bash
npm run dev
```

## Testing

Run the comprehensive API test suite:

```bash
npm test
```

This will test all implemented features:
- ✅ User authentication (registration/login)
- ✅ Job posting functionality (admin only)
- ✅ Application tracking (create/view applications)
- ✅ File upload for resumes (Cloudinary integration)
- ✅ Email notifications (welcome/application updates)
- ✅ Admin dashboard (statistics and management)

### Creating Admin User

Create an admin user for testing admin features:

```bash
npm run create-admin
```

This creates an admin user with:
- Email: `admin@talex.com`
- Password: `admin123`
- Phone: `+254700000000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration with Kenyan phone support
- `POST /api/auth/login` - User/Admin login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/reset-password` - Password reset

### Jobs
- `GET /api/jobs` - List active jobs
- `GET /api/jobs/search` - Search jobs with filters
- `GET /api/jobs/:id` - Get job details

### Applications
- `POST /api/applications/create` - Submit job application (requires payment)
- `GET /api/applications/user` - Get user's applications
- `GET /api/applications/:id` - Get application details

### Profile Management
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile, resume summary, experience, and LinkedIn

### Support & Issue Reporting
- `POST /api/support` - Send contact support or issue report with category, subject, and message
- `GET /api/support` - Get current user's support requests

### Payments
- `POST /api/payments/stkpush` - Initiate M-Pesa payment
- `POST /api/payments/callback` - M-Pesa payment callback
- `POST /api/payments/verify` - Verify payment status

### File Upload
- `POST /api/upload` - Upload resume/CV (Cloudinary)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/read/:id` - Mark notification as read

### Admin (Requires Admin Role)
- `POST /api/admin/jobs/create` - Create new job
- `PUT /api/admin/jobs/update/:id` - Update job
- `DELETE /api/admin/jobs/delete/:id` - Delete job
- `GET /api/admin/applications` - View all applications
- `PATCH /api/admin/applications/update-status` - Update application status
- `GET /api/admin/support-requests` - View all support requests
- `PATCH /api/admin/support-requests/reply` - Reply to support request and close it
- `GET /api/admin/users` - View all users
- `GET /api/admin/payments` - View all payments
- `GET /api/admin/dashboard` - Dashboard statistics

## Backend Guide

See `BACKEND_GUIDE.md` for Talex backend setup, API details, environment variables, and frontend integration notes.
