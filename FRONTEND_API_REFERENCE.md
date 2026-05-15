# Frontend API Reference - BackendTalex

This file contains all backend API endpoints for the Talex frontend. All endpoints return JSON responses with `{ success: boolean, message: string, data: any }` format.

## Authentication

### Register User
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Body**: `{ name, email, password, phone? }`
- **Response**: `{ success, message, data: { token, role, user } }`

### Login User
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ success, message, data: { token, role, user } }`

### Forgot Password
- **Method**: `POST`
- **Endpoint**: `/api/auth/forgot-password`
- **Body**: `{ email }`
- **Response**: Success message (email sent)

### Reset Password
- **Method**: `POST`
- **Endpoint**: `/api/auth/reset-password`
- **Body**: `{ token, newPassword }`
- **Response**: Success message

### Verify Email
- **Method**: `GET`
- **Endpoint**: `/api/auth/verify/:token`
- **Response**: Success message or redirect

## Jobs

### Get All Jobs
- **Method**: `GET`
- **Endpoint**: `/api/jobs`
- **Auth**: None required
- **Response**: `{ jobs: [] }`

### Get Job Details
- **Method**: `GET`
- **Endpoint**: `/api/jobs/:id`
- **Auth**: None required
- **Response**: `{ job: {} }`

### Search Jobs
- **Method**: `GET`
- **Endpoint**: `/api/jobs/search?query=...`
- **Auth**: None required
- **Response**: `{ jobs: [] }`

### Create Job (Admin)
- **Method**: `POST`
- **Endpoint**: `/api/admin/jobs/create`
- **Auth**: Admin required
- **Body**: `{ title, company, description, requirements, benefits?, salary?, province, visaSponsored?, deadline, status? }`
- **Response**: `{ job: {} }`

### Update Job (Admin)
- **Method**: `PUT`
- **Endpoint**: `/api/admin/jobs/update/:id`
- **Auth**: Admin required
- **Body**: Job fields to update
- **Response**: `{ job: {} }`

### Delete Job (Admin)
- **Method**: `DELETE`
- **Endpoint**: `/api/admin/jobs/delete/:id`
- **Auth**: Admin required
- **Response**: Success message

## Applications

### Create Application
- **Method**: `POST`
- **Endpoint**: `/api/applications/create`
- **Auth**: User required
- **Body**: `{ jobId, paymentId }`
- **Response**: `{ application: {} }`

### Get User Applications
- **Method**: `GET`
- **Endpoint**: `/api/applications/user`
- **Auth**: User required
- **Response**: `{ applications: [] }`

### Get All Applications (Admin)
- **Method**: `GET`
- **Endpoint**: `/api/admin/applications`
- **Auth**: Admin required
- **Response**: `{ applications: [] }`

### Update Application Status (Admin)
- **Method**: `PATCH`
- **Endpoint**: `/api/admin/applications/update-status`
- **Auth**: Admin required
- **Body**: `{ applicationId, status }`
- **Response**: `{ application: {} }`

## Payments

### Initiate M-Pesa Payment
- **Method**: `POST`
- **Endpoint**: `/api/payments/stkpush`
- **Auth**: User required
- **Body**: `{ phone, amount, jobId }`
- **Response**: Payment initiation data

### Payment Callback
- **Method**: `POST`
- **Endpoint**: `/api/payments/callback`
- **Auth**: None (webhook)
- **Body**: M-Pesa callback data

### Verify Payment
- **Method**: `POST`
- **Endpoint**: `/api/payments/verify`
- **Auth**: User required
- **Body**: Payment verification data

## Profile

### Get Profile
- **Method**: `GET`
- **Endpoint**: `/api/profile`
- **Auth**: User required
- **Response**: `{ profile: { ...userData, documents: [] } }`

### Update Profile
- **Method**: `PUT`
- **Endpoint**: `/api/profile`
- **Auth**: User required
- **Body**: Profile fields to update
- **Response**: `{ profile: {} }`

## Notifications

### Get Notifications
- **Method**: `GET`
- **Endpoint**: `/api/notifications`
- **Auth**: User required
- **Response**: `{ notifications: [] }`

### Mark Notification Read
- **Method**: `PATCH`
- **Endpoint**: `/api/notifications/read/:id`
- **Auth**: User required
- **Response**: Success message

## Support

### Create Support Request
- **Method**: `POST`
- **Endpoint**: `/api/support`
- **Auth**: User required
- **Body**: `{ category, subject, message }`
- **Response**: Success message

### Get User Support Requests
- **Method**: `GET`
- **Endpoint**: `/api/support`
- **Auth**: User required
- **Response**: `{ supportRequests: [] }`

## File Upload

### Upload Resume/Document
- **Method**: `POST`
- **Endpoint**: `/api/upload/upload-resume`
- **Auth**: User required
- **Body**: Form data with `resume` file and optional `type`
- **Response**: `{ document: {} }`

### Get User Documents
- **Method**: `GET`
- **Endpoint**: `/api/upload/documents`
- **Auth**: User required
- **Response**: `{ documents: [] }`

## Admin Users

### Get All Users (Admin)
- **Method**: `GET`
- **Endpoint**: `/api/admin/users`
- **Auth**: Admin required
- **Response**: `{ users: [] }` (with complete profile data, documents, applications, payments)

### Get User Details (Admin)
- **Method**: `GET`
- **Endpoint**: `/api/admin/users/:id`
- **Auth**: Admin required
- **Response**: `{ user: {} }` (complete user profile with all data, applications, payments, notifications, support requests)

### Ban/Unban User (Admin)
- **Method**: `PATCH`
- **Endpoint**: `/api/admin/users/:id/ban`
- **Auth**: Admin required
- **Body**: `{ ban: true|false }`
- **Response**: `{ user: {} }`

### Reset User Password (Admin)
- **Method**: `PATCH`
- **Endpoint**: `/api/admin/users/:id/password`
- **Auth**: Admin required
- **Body**: `{ newPassword }`
- **Response**: Success message

### Update User (Admin)
- **Method**: `PATCH`
- **Endpoint**: `/api/admin/users/:id`
- **Auth**: Admin required
- **Body**: User fields to update
- **Response**: `{ user: {} }`

## Admin Dashboard

### Get Dashboard Stats (Admin)
- **Method**: `GET`
- **Endpoint**: `/api/admin/dashboard`
- **Auth**: Admin required
- **Response**: `{ totalUsers, totalJobs, totalApplications, revenue }`

## Admin Support

### Get All Support Requests (Admin)
- **Method**: `GET`
- **Endpoint**: `/api/admin/support-requests`
- **Auth**: Admin required
- **Response**: `{ supportRequests: [] }`

### Reply to Support Request (Admin)
- **Method**: `PATCH`
- **Endpoint**: `/api/admin/support-requests/reply`
- **Auth**: Admin required
- **Body**: `{ requestId, reply }`
- **Response**: `{ supportRequest: {} }`

## Admin Payments

### Get All Payments (Admin)
- **Method**: `GET`
- **Endpoint**: `/api/admin/payments`
- **Auth**: Admin required
- **Response**: `{ payments: [] }`

## Notes

- **Authentication**: Include `Authorization: Bearer <token>` header for protected routes
- **Admin Routes**: Require admin role in JWT token
- **File Upload**: Use FormData for file uploads
- **Response Format**: All endpoints return `{ success: boolean, message: string, data: any }`
- **Error Handling**: Check `success` field and handle errors appropriately
- **CORS**: Frontend should be served from allowed origins (configured in backend)

## Base URL

All endpoints should be prefixed with your backend URL, e.g.:
- Development: `http://localhost:10000`
- Production: Your deployed backend URL

## Testing

Use the included `test-api.js` script to test endpoints:
```bash
npm run test
```