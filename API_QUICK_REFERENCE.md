# 🚀 API Quick Reference - BackendTalex

**Base URL**: `https://your-backend-url/api`

---

## 🔐 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login user |
| GET | `/auth/verify/:token` | ❌ | Verify email |
| POST | `/auth/refresh` | ❌ | Refresh access token |
| POST | `/auth/logout` | ✅ | Logout user |
| POST | `/auth/forgot-password` | ❌ | Request password reset |
| POST | `/auth/reset-password` | ❌ | Reset password with token |

---

## 💼 Jobs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/jobs` | ❌ | List all jobs |
| GET | `/jobs/:id` | ❌ | Get job details |
| GET | `/jobs/search` | ❌ | Search jobs |
| POST | `/jobs` | ✅👑 | Create job (Admin) |
| PUT | `/admin/jobs/update/:id` | ✅👑 | Update job (Admin) |
| DELETE | `/admin/jobs/delete/:id` | ✅👑 | Delete job (Admin) |

---

## 📝 Applications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/applications/create` | ✅ | Apply for job |
| GET | `/applications/user` | ✅ | Get my applications |
| GET | `/applications/:id` | ✅ | Get application details |
| PATCH | `/admin/applications/update-status` | ✅👑 | Update status (Admin) |
| GET | `/admin/applications` | ✅👑 | Get all applications (Admin) |

---

## 👤 Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile` | ✅ | Get my profile |
| PUT | `/profile` | ✅ | Update my profile |

---

## 💳 Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/stkpush` | ✅ | Initiate M-Pesa payment |
| POST | `/payments/callback` | ⚙️ | M-Pesa callback (backend) |
| POST | `/payments/verify` | ✅ | Verify payment status |

---

## 🔔 Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | ✅ | Get my notifications |
| PATCH | `/notifications/read/:id` | ✅ | Mark notification as read |

---

## 💬 Support

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/support` | ✅ | Create support request |
| GET | `/support` | ✅ | Get my support requests |
| PATCH | `/admin/support-requests/reply` | ✅👑 | Reply to request (Admin) |
| GET | `/admin/support-requests` | ✅👑 | Get all requests (Admin) |

---

## 📤 File Upload

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload/upload-resume` | ✅ | Upload resume file |

---

## 👨‍💼 Admin Only

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/users` | ✅👑 | List all users |
| GET | `/admin/payments` | ✅👑 | List all payments |
| GET | `/admin/dashboard` | ✅👑 | Dashboard statistics |
| POST | `/report` | ✅👑 | Generate reports |

---

## 📋 Legend

- ❌ = No authentication required
- ✅ = Authentication required (Bearer token)
- 👑 = Admin role required
- ⚙️ = Backend-only (don't call from frontend)

---

## 🔑 Authorization Header

```
Authorization: Bearer {accessToken}
```

---

## ⚡ Common Query Parameters

```
?page=1              // Pagination page number
&limit=10            // Items per page
&sort=createdAt      // Sort field
&order=desc          // Sort order (asc/desc)
&status=pending      // Filter by status
&search=keyword      // Search query
```

---

## ✅ Common Validation Rules

### Phone (International)
- Format: `+254798989881` or `254798989881`
- Length: 10-15 digits

### Email
- Format: `user@example.com`
- Must contain @ and domain

### Password
- Minimum 8 characters
- Must include: UPPERCASE, number, special char (@$!%*?&)

### Name
- Minimum 2, Maximum 100 characters

---

## 🎯 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | ✅ Success |
| 201 | ✅ Created |
| 400 | ❌ Bad Request |
| 401 | ❌ Unauthorized |
| 403 | ❌ Forbidden (Admin required) |
| 404 | ❌ Not Found |
| 409 | ❌ Conflict |
| 429 | ❌ Too Many Requests |
| 500 | ❌ Server Error |

---

## 📱 Frontend Setup

### 1. Store Tokens After Login
```javascript
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);
```

### 2. Include in Requests
```javascript
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  'Content-Type': 'application/json'
};
```

### 3. Handle Token Expiry
```javascript
if (response.status === 401) {
  // Token expired, refresh it
  const newToken = await refreshAccessToken();
  // Retry request with new token
}
```

---

## 🚀 Example Calls

### Login
```bash
curl -X POST https://api.talex.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123!"}'
```

### Get Profile
```bash
curl -X GET https://api.talex.com/api/profile \
  -H "Authorization: Bearer {token}"
```

### Apply for Job
```bash
curl -X POST https://api.talex.com/api/applications/create \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"jobId":"job_123","coverLetter":"..."}'
```

---

**For detailed documentation, see**: `FRONTEND_API_GUIDE.md`

**Last Updated**: May 8, 2026
