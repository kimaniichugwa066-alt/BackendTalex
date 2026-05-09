# 🔐 Authentication & Email System Setup - Complete Guide

## ✅ **What's Been Implemented**

### 1. **User Model (Mongoose)** ✓
File: [src/models/User.ts](src/models/User.ts)

Features:
- ✅ Password hashing with bcryptjs (pre-save hook)
- ✅ Role-based access: `"user"` | `"admin"`
- ✅ Methods: `comparePassword()`, `matchPassword()`
- ✅ Resume field (Cloudinary URL)
- ✅ Timestamps (createdAt, updatedAt)

**Schema:**
```typescript
{
  fullName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: String (enum: ["user", "admin"]),
  resume: String (Cloudinary URL),
  timestamps: true
}
```

### 2. **JWT Token Generation** ✓
File: [src/utils/generateToken.ts](src/utils/generateToken.ts)

```typescript
generateToken(user) → JWT token with:
  - user._id
  - user.role
  - user.email
  - Expires: 7 days
```

### 3. **Authentication Middleware** ✓
File: [src/middleware/authMiddleware.ts](src/middleware/authMiddleware.ts)

**Two Middlewares:**
1. **`authMiddleware`** - Verifies JWT token & attaches user to request
2. **`adminOnly`** - Ensures user is admin (use after authMiddleware)

**Usage:**
```typescript
// Protect all routes
router.use(authMiddleware);

// Admin-only routes
router.put('/:id/status', authMiddleware, adminOnly, updateHandler);
```

### 4. **Mongoose Auth Controller** ✓
File: [src/controllers/authMongooseController.ts](src/controllers/authMongooseController.ts)

**Endpoints:**
- `POST /auth/register` - Create user with optional resume upload
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user (requires auth)

**Response Format:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 5. **Brevo Email Service** ✓
File: [src/utils/sendEmail.ts](src/utils/sendEmail.ts)

**Features:**
- ✅ Send transactional emails via Brevo
- ✅ HTML email templates
- ✅ Error handling & logging
- ✅ Async execution

**Usage:**
```typescript
import { sendEmail } from '../utils/sendEmail';

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to Talex',
  html: '<h1>Welcome!</h1>'
});
```

### 6. **Application Status Emails** ✓
File: [src/controllers/applicationMongooseController.ts](src/controllers/applicationMongooseController.ts)

**Automatic Email Sending:**

1. **When Application is ACCEPTED:**
   - Subject: `🎉 Application Accepted - Talex`
   - Content: Congratulations message, job title, company
   - Sent to: Applicant email

2. **When Application is REJECTED:**
   - Subject: `Application Update - Talex`
   - Content: Thank you message, encouragement to apply elsewhere
   - Sent to: Applicant email

---

## 🚀 **How to Use**

### **1. Environment Setup**
Update [.env](.env) with:
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=supersecretjwtkey
BREVO_API_KEY=xkeysib-...
SENDER_EMAIL=support@talex.com
SENDER_NAME=Talex Jobs
```

### **2. Register New User**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "password": "SecurePass123"
  }'

# With resume upload:
curl -X POST http://localhost:4000/api/auth/register \
  -F "fullName=John Doe" \
  -F "email=john@example.com" \
  -F "phone=+254712345678" \
  -F "password=SecurePass123" \
  -F "resume=@resume.pdf"
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### **3. Login User**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### **4. Access Protected Routes**
```bash
curl -X GET http://localhost:4000/api/applications/all \
  -H "Authorization: Bearer eyJhbGc..."
```

### **5. Admin - Update Application Status**
```bash
curl -X PUT http://localhost:4000/api/applications/APP_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{ "status": "accepted" }'
```

**Automatically sends:**
- 🎉 Acceptance email to applicant
- Includes: job title, company name, next steps

---

## 📋 **Application Status Update Flow**

```
1. Admin calls: PUT /applications/:id/status
2. Middleware validates: authMiddleware → adminOnly
3. Controller updates status in MongoDB
4. Brevo sends email:
   ├─ If "accepted" → Congratulations email
   └─ If "rejected" → Thank you email
5. Response sent to admin
```

**Status Enum:**
- `"pending"` - Initial status
- `"reviewed"` - Admin has reviewed
- `"accepted"` - Applicant accepted
- `"rejected"` - Applicant rejected

---

## 🔒 **Security Features**

✅ **Passwords:** Hashed with bcryptjs (10 salt rounds)
✅ **JWT:** 7-day expiration
✅ **Role-based Access:** admin | user
✅ **Token Validation:** Required for protected routes
✅ **Admin Protection:** adminOnly middleware on sensitive endpoints
✅ **Duplicate Prevention:** Cannot re-apply same job
✅ **Access Control:** Users can only see own applications

---

## 📚 **File References**

| File | Purpose |
|------|---------|
| [src/models/User.ts](src/models/User.ts) | User schema with auth methods |
| [src/utils/generateToken.ts](src/utils/generateToken.ts) | JWT token generation |
| [src/utils/sendEmail.ts](src/utils/sendEmail.ts) | Brevo email service |
| [src/middleware/authMiddleware.ts](src/middleware/authMiddleware.ts) | Auth & admin middlewares |
| [src/controllers/authMongooseController.ts](src/controllers/authMongooseController.ts) | Register/Login endpoints |
| [src/controllers/applicationMongooseController.ts](src/controllers/applicationMongooseController.ts) | Application with emails |
| [src/routes/authMongooseRoutes.ts](src/routes/authMongooseRoutes.ts) | Auth routes |
| [src/routes/applicationRoutes.ts](src/routes/applicationRoutes.ts) | Application routes |

---

## ⚙️ **Integration Checklist**

- [ ] Update `.env` with Brevo API key
- [ ] Test Register endpoint with resume upload
- [ ] Test Login endpoint
- [ ] Test Admin status update
- [ ] Check email received in inbox
- [ ] Verify admin-only protection on status endpoint

✅ **Everything is ready!**
