# 🚀 Frontend API Guide - BackendTalex

Complete API documentation for the BackendTalex platform. All endpoints are available at: **`https://your-backend-url/api`**

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Jobs](#jobs)
3. [Applications](#applications)
4. [Profile](#profile)
5. [Payments (M-Pesa)](#payments-mpesa)
6. [Notifications](#notifications)
7. [Support Requests](#support-requests)
8. [File Upload](#file-upload)
9. [Admin Panel](#admin-panel)
10. [Error Handling](#error-handling)

---

## 🔐 Authentication

### 1. Register User

**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Kimani",
  "email": "john@example.com",
  "phone": "+254798989881",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- `name`: 2-100 characters
- `email`: Valid email format (user@domain.extension)
- `phone`: +[country code][10-15 digits] or [10-15 digits] (supports international format)
- `password`: Minimum 8 characters with uppercase, number, and special character

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "user_id_123",
    "name": "John Kimani",
    "email": "john@example.com",
    "phone": "+254798989881",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here"
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

### 2. Login User

**POST** `/api/auth/login`

Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id_123",
    "name": "John Kimani",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here"
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### 3. Verify Email

**GET** `/api/auth/verify/:token`

Verify user email using verification token (sent via email).

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### 4. Refresh Token

**POST** `/api/auth/refresh`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "new_access_token_here",
  "refreshToken": "new_refresh_token_here"
}
```

---

### 5. Logout

**POST** `/api/auth/logout`

Logout user and invalidate tokens. Requires authentication.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 6. Forgot Password

**POST** `/api/auth/forgot-password`

Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 7. Reset Password

**POST** `/api/auth/reset-password`

Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 💼 Jobs

### 1. Get All Jobs

**GET** `/api/jobs`

Retrieve all available jobs with pagination.

**Query Parameters:**
```
?page=1&limit=10&sort=createdAt&order=desc
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "job_123",
      "title": "Senior Software Engineer",
      "description": "Join our team...",
      "company": "Tech Corp",
      "location": "Toronto, Canada",
      "salary": "$80,000 - $120,000",
      "jobType": "full-time",
      "experienceLevel": "senior",
      "skills": ["Node.js", "React", "PostgreSQL"],
      "deadline": "2026-06-08",
      "createdAt": "2026-05-08T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45
  }
}
```

---

### 2. Get Job by ID

**GET** `/api/jobs/:id`

Get detailed information about a specific job.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "job_123",
    "title": "Senior Software Engineer",
    "description": "Full description...",
    "company": "Tech Corp",
    "location": "Toronto, Canada",
    "salary": "$80,000 - $120,000",
    "jobType": "full-time",
    "experienceLevel": "senior",
    "skills": ["Node.js", "React", "PostgreSQL"],
    "applicationsCount": 12,
    "deadline": "2026-06-08",
    "createdAt": "2026-05-08T10:00:00Z"
  }
}
```

---

### 3. Search Jobs

**GET** `/api/jobs/search`

Search jobs by keywords, location, or filters.

**Query Parameters:**
```
?q=software+engineer&location=Toronto&jobType=full-time&minSalary=80000&maxSalary=150000
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "job_123",
      "title": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "Toronto, Canada",
      "salary": "$80,000 - $120,000"
    }
  ],
  "total": 25
}
```

---

### 4. Create Job (Admin Only)

**POST** `/api/jobs`

Create a new job posting. Requires admin role.

**Headers:**
```
Authorization: Bearer {adminAccessToken}
```

**Request Body:**
```json
{
  "title": "Senior Software Engineer",
  "description": "We are looking for...",
  "company": "Tech Corp",
  "location": "Toronto, Canada",
  "salary": "$80,000 - $120,000",
  "jobType": "full-time",
  "experienceLevel": "senior",
  "skills": ["Node.js", "React", "PostgreSQL"],
  "deadline": "2026-06-08"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "id": "job_123",
    "title": "Senior Software Engineer",
    "company": "Tech Corp"
  }
}
```

---

### 5. Update Job (Admin Only)

**PUT** `/api/admin/jobs/update/:id`

Update an existing job posting.

**Request Body:**
```json
{
  "title": "Principal Software Engineer",
  "salary": "$100,000 - $150,000",
  "deadline": "2026-07-08"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "id": "job_123",
    "title": "Principal Software Engineer"
  }
}
```

---

### 6. Delete Job (Admin Only)

**DELETE** `/api/admin/jobs/delete/:id`

Delete a job posting.

**Response (200):**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

## 📝 Applications

### 1. Create Application

**POST** `/api/applications/create`

Apply for a job.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "jobId": "job_123",
  "coverLetter": "I am interested in this position...",
  "resumeUrl": "https://cloudinary.com/resume.pdf"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": "app_123",
    "jobId": "job_123",
    "status": "pending",
    "appliedAt": "2026-05-08T10:00:00Z"
  }
}
```

---

### 2. Get User Applications

**GET** `/api/applications/user`

Get all applications by the current user.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
```
?page=1&limit=10&status=pending
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "app_123",
      "jobId": "job_123",
      "jobTitle": "Senior Software Engineer",
      "company": "Tech Corp",
      "status": "pending",
      "appliedAt": "2026-05-08T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

---

### 3. Get Application by ID

**GET** `/api/applications/:id`

Get detailed information about a specific application.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "app_123",
    "jobId": "job_123",
    "jobTitle": "Senior Software Engineer",
    "company": "Tech Corp",
    "coverLetter": "I am interested...",
    "resumeUrl": "https://cloudinary.com/resume.pdf",
    "status": "pending",
    "appliedAt": "2026-05-08T10:00:00Z"
  }
}
```

---

### 4. Update Application Status (Admin Only)

**PATCH** `/api/admin/applications/update-status`

Update application status (accept/reject/shortlist).

**Headers:**
```
Authorization: Bearer {adminAccessToken}
```

**Request Body:**
```json
{
  "applicationId": "app_123",
  "status": "accepted"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Application status updated",
  "data": {
    "id": "app_123",
    "status": "accepted"
  }
}
```

---

## 👤 Profile

### 1. Get User Profile

**GET** `/api/profile`

Get current user's profile information.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Kimani",
    "email": "john@example.com",
    "phone": "+254798989881",
    "headline": "Senior Software Engineer",
    "location": "Toronto, Canada",
    "summary": "Passionate about building scalable systems...",
    "experience": "8 years of experience...",
    "education": "B.Sc. Computer Science...",
    "linkedIn": "https://linkedin.com/in/johnkimani",
    "resumeUrl": "https://cloudinary.com/resume.pdf",
    "profilePictureUrl": "https://cloudinary.com/profile.jpg",
    "createdAt": "2026-01-15T10:00:00Z"
  }
}
```

---

### 2. Update User Profile

**PUT** `/api/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "name": "John Kimani",
  "phone": "+254798989881",
  "headline": "Senior Software Engineer",
  "location": "Toronto, Canada",
  "summary": "Passionate about building scalable systems...",
  "experience": "8 years of experience...",
  "education": "B.Sc. Computer Science...",
  "linkedIn": "https://linkedin.com/in/johnkimani"
}
```

**Validation Rules:**
- `name`: 2-100 characters
- `phone`: +[country code][10-15 digits] or [10-15 digits]
- `headline`: Max 120 characters
- `location`: Max 100 characters
- `summary`: Max 1000 characters
- `experience`: Max 1000 characters
- `education`: Max 1000 characters
- `linkedIn`: Valid URL format

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_123",
    "name": "John Kimani",
    "headline": "Senior Software Engineer"
  }
}
```

---

## 💳 Payments (M-Pesa)

### 1. Initiate STK Push (M-Pesa)

**POST** `/api/payments/stkpush`

Initiate M-Pesa payment using Daraja API.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "phone": "254798989881",
  "amount": 500,
  "description": "Premium job application package"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "STK push initiated",
  "data": {
    "checkoutRequestId": "ws_CO_DMZ_123_2026050810001234",
    "responseCode": "0",
    "customerMessage": "Success. Request accepted for processing"
  }
}
```

---

### 2. M-Pesa Callback

**POST** `/api/payments/callback`

M-Pesa callback endpoint (called by Safaricom, not frontend).

**Purpose:** Receives payment confirmation from M-Pesa. Handle automatically on backend.

---

### 3. Verify Payment

**POST** `/api/payments/verify`

Verify if a payment was successful.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "checkoutRequestId": "ws_CO_DMZ_123_2026050810001234"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "checkoutRequestId": "ws_CO_DMZ_123_2026050810001234",
    "status": "completed",
    "amount": 500,
    "transactionRef": "LHG31Z5VQV",
    "verifiedAt": "2026-05-08T10:05:00Z"
  }
}
```

---

## 🔔 Notifications

### 1. Get Notifications

**GET** `/api/notifications`

Get all notifications for the current user.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
```
?page=1&limit=20&unreadOnly=false
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_123",
      "type": "application_status",
      "title": "Application Update",
      "message": "Your application for Senior Software Engineer was accepted!",
      "isRead": false,
      "createdAt": "2026-05-08T10:00:00Z"
    },
    {
      "id": "notif_124",
      "type": "new_job",
      "title": "New Job Match",
      "message": "A new job matching your profile: Senior Developer",
      "isRead": true,
      "createdAt": "2026-05-07T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "unread": 3
  }
}
```

---

### 2. Mark Notification as Read

**PATCH** `/api/notifications/read/:id`

Mark a specific notification as read.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "id": "notif_123",
    "isRead": true
  }
}
```

---

## 💬 Support Requests

### 1. Create Support Request

**POST** `/api/support`

Create a new support/help request.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "subject": "Unable to upload resume",
  "category": "technical",
  "message": "I'm having trouble uploading my resume file. The system shows an error message.",
  "priority": "high"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Support request created successfully",
  "data": {
    "id": "support_123",
    "status": "open",
    "ticketNumber": "SUPPORT_2026_001",
    "createdAt": "2026-05-08T10:00:00Z"
  }
}
```

---

### 2. Get User Support Requests

**GET** `/api/support`

Get all support requests created by the current user.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
```
?page=1&limit=10&status=open
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "support_123",
      "ticketNumber": "SUPPORT_2026_001",
      "subject": "Unable to upload resume",
      "category": "technical",
      "status": "open",
      "priority": "high",
      "createdAt": "2026-05-08T10:00:00Z",
      "reply": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3
  }
}
```

---

### 3. Reply to Support Request (Admin Only)

**PATCH** `/api/admin/support-requests/reply`

Admin reply to a support request.

**Headers:**
```
Authorization: Bearer {adminAccessToken}
```

**Request Body:**
```json
{
  "requestId": "support_123",
  "reply": "Thank you for contacting us. We've identified the issue and uploaded a new version..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reply sent successfully",
  "data": {
    "id": "support_123",
    "status": "responded",
    "reply": "Thank you for contacting us..."
  }
}
```

---

## 📤 File Upload

### 1. Upload Resume

**POST** `/api/upload/upload-resume`

Upload a resume file (PDF, DOC, DOCX).

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Form Data:**
```
resume: [file object]
```

**Response (200):**
```json
{
  "success": true,
  "fileUrl": "https://res.cloudinary.com/talex/image/upload/v1620000000/resumes/user_123_resume.pdf"
}
```

---

## 👨‍💼 Admin Panel

All admin endpoints require `adminAccessToken` and admin role.

**Headers:**
```
Authorization: Bearer {adminAccessToken}
```

### 1. Get All Applications

**GET** `/api/admin/applications`

Get all job applications across all jobs.

**Query Parameters:**
```
?page=1&limit=20&status=pending&sortBy=createdAt
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "app_123",
      "jobId": "job_123",
      "jobTitle": "Senior Software Engineer",
      "applicantName": "John Kimani",
      "applicantEmail": "john@example.com",
      "status": "pending",
      "appliedAt": "2026-05-08T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 125
  }
}
```

---

### 2. Get All Support Requests

**GET** `/api/admin/support-requests`

Get all support requests from all users.

**Query Parameters:**
```
?page=1&limit=20&status=open&priority=high
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "support_123",
      "ticketNumber": "SUPPORT_2026_001",
      "userName": "John Kimani",
      "userEmail": "john@example.com",
      "subject": "Unable to upload resume",
      "priority": "high",
      "status": "open",
      "createdAt": "2026-05-08T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}
```

---

### 3. Get All Users

**GET** `/api/admin/users`

Get all registered users.

**Query Parameters:**
```
?page=1&limit=20&role=user&sortBy=createdAt
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_123",
      "name": "John Kimani",
      "email": "john@example.com",
      "phone": "+254798989881",
      "role": "user",
      "createdAt": "2026-01-15T10:00:00Z",
      "applicationsCount": 5,
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 523
  }
}
```

---

### 4. Get All Payments

**GET** `/api/admin/payments`

Get all payments made on the platform.

**Query Parameters:**
```
?page=1&limit=20&status=completed&startDate=2026-05-01&endDate=2026-05-08
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "payment_123",
      "userName": "John Kimani",
      "userEmail": "john@example.com",
      "amount": 500,
      "currency": "KES",
      "status": "completed",
      "transactionRef": "LHG31Z5VQV",
      "paymentMethod": "mpesa",
      "createdAt": "2026-05-08T10:05:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 87
  },
  "summary": {
    "totalAmount": 43500,
    "currency": "KES",
    "completedPayments": 87,
    "pendingPayments": 3
  }
}
```

---

### 5. Get Dashboard Stats

**GET** `/api/admin/dashboard`

Get dashboard statistics and overview.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 523,
    "totalJobs": 45,
    "totalApplications": 1234,
    "totalRevenue": 43500,
    "currency": "KES",
    "metrics": {
      "newUsersThisMonth": 87,
      "newApplicationsThisMonth": 234,
      "revenueThisMonth": 15000,
      "averageApplicationsPerJob": 27.4,
      "acceptanceRate": 0.18
    },
    "applicationStatus": {
      "pending": 456,
      "accepted": 234,
      "rejected": 312,
      "shortlisted": 232
    },
    "recentActivity": {
      "lastUserJoined": "2026-05-08T09:30:00Z",
      "lastApplicationSubmitted": "2026-05-08T09:45:00Z",
      "lastPaymentReceived": "2026-05-08T10:05:00Z"
    }
  }
}
```

---

### 6. Generate Report

**POST** `/api/report`

Generate analytics reports.

**Request Body:**
```json
{
  "type": "applications",
  "startDate": "2026-04-08",
  "endDate": "2026-05-08"
}
```

**Report Types:**
- `applications` - Application statistics
- `jobs` - Job posting analytics
- `users` - User registration report
- `revenue` - Payment and revenue report

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reportType": "applications",
    "period": {
      "start": "2026-04-08",
      "end": "2026-05-08"
    },
    "summary": {
      "totalApplications": 234,
      "successfulApplications": 42,
      "successRate": 0.18,
      "averageTimeToAcceptance": "4.5 days"
    },
    "jobBreakdown": [
      {
        "jobId": "job_123",
        "jobTitle": "Senior Software Engineer",
        "applicationsCount": 28,
        "acceptedCount": 5
      }
    ],
    "generatedAt": "2026-05-08T10:00:00Z"
  }
}
```

---

## ❌ Error Handling

### Standard Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message here",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | User profile retrieved |
| 201 | Created | New job application created |
| 400 | Bad Request | Invalid email format |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Admin-only endpoint accessed by user |
| 404 | Not Found | Job ID doesn't exist |
| 409 | Conflict | Email already registered |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Database connection failed |

### Common Error Responses

**Invalid Email:**
```json
{
  "success": false,
  "error": "Invalid email format",
  "details": {
    "field": "email",
    "expected": "Valid email like user@example.com"
  }
}
```

**Missing Token:**
```json
{
  "success": false,
  "error": "No authorization token provided"
}
```

**Token Expired:**
```json
{
  "success": false,
  "error": "Token has expired",
  "hint": "Use refresh token to get new access token"
}
```

**Admin Access Required:**
```json
{
  "success": false,
  "error": "Admin privileges required"
}
```

---

## 🔑 Authentication Token Usage

### Getting Started

1. **Register** or **Login** to get tokens
2. **Store tokens** securely (localStorage, sessionStorage)
3. **Include token** in Authorization header for protected routes

### Token Management

```javascript
// Set token in headers
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};

// Refresh token when expired
const response = await fetch('/api/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken })
});
```

---

## 🚨 Rate Limiting

The API enforces rate limiting to prevent abuse:

- **Limit**: 120 requests per 15 minutes
- **Headers**: 
  - `RateLimit-Limit`: 120
  - `RateLimit-Remaining`: 119
  - `RateLimit-Reset`: Timestamp when limit resets

**Error (429 Too Many Requests):**
```json
{
  "success": false,
  "error": "Too many requests, please try again later",
  "retryAfter": 900
}
```

---

## 📚 Frontend Integration Examples

### React Example - Login

```javascript
async function login(email, password) {
  const response = await fetch('https://api.talex.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
  throw new Error(data.error);
}
```

### React Example - Get Profile

```javascript
async function getProfile() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('https://api.talex.com/api/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  if (data.success) {
    return data.data;
  }
  throw new Error(data.error);
}
```

### React Example - Apply for Job

```javascript
async function applyForJob(jobId, coverLetter, resumeUrl) {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('https://api.talex.com/api/applications/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jobId,
      coverLetter,
      resumeUrl
    })
  });
  
  const data = await response.json();
  if (data.success) {
    return data.data;
  }
  throw new Error(data.error);
}
```

---

## 🎯 Support & Contact

For API issues, questions, or feature requests:

- **Email**: support@talex.com
- **Documentation**: https://docs.talex.com
- **GitHub Issues**: https://github.com/talex/backend/issues

---

**Last Updated**: May 8, 2026
**API Version**: 1.0
**Environment**: Production
