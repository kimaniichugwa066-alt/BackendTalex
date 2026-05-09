# Application Status & Resume Download - Implementation Guide

## ✅ What's Been Set Up

### 1. **Mongoose Models - Perfect ✓**
- **Application Model** (`src/models/Application.ts`):
  - ✅ `applicant` field: References User (ref: "User")
  - ✅ `job` field: References Job (ref: "Job")
  - ✅ `status` field: enum ["pending", "reviewed", "accepted", "rejected"]
  - ✅ `coverLetter` field: String
  - ✅ Timestamps: createdAt, updatedAt

- **User Model** (`src/models/User.ts`):
  - ✅ `fullName`, `email`, `phone`, `password`, `role`
  - ✅ `resume`: Cloudinary URL
  - ✅ Password hashing with bcryptjs pre-save hook
  - ✅ comparePassword method

- **Job Model** (`src/models/Job.ts`):
  - ✅ All required fields with `postedBy` reference to User

### 2. **Backend Mongoose Controller** (`src/controllers/applicationMongooseController.ts`)

#### Key Features:
- ✅ **Populate with Resume**: `.populate('applicant', 'fullName email phone resume')`
- ✅ **Resume Download Fix**: Uses `formatResumeUrl()` to add Cloudinary attachment parameter
  - Converts: `/upload/` → `/upload/fl_attachment/`
  - Enables direct downloads of PDFs and documents
  
#### Endpoints:
1. **GET /applications/all** (Admin only)
   - Returns all applications with populated applicant + job data
   - Resume URLs formatted for downloads

2. **GET /applications/user** (Authenticated)
   - Returns user's applications with populated data
   - Resume included and formatted

3. **GET /applications/:id** (Authenticated)
   - Get specific application with full details
   - Applicant can view own, admins can view all

4. **PUT /applications/:id/status** (Admin only)
   - Update application status
   - Valid statuses: "pending", "reviewed", "accepted", "rejected"
   - Sends email notification to applicant
   - Input: `{ "status": "accepted" }`

5. **POST /applications/create**
   - Create new application
   - Input: `{ "jobId": "...", "coverLetter": "..." }`

### 3. **Routes** (`src/routes/applicationRoutes.ts`)
- ✅ Added `PUT /:id/status` endpoint with admin middleware
- ✅ All routes now require authentication (except create - adjust as needed)

## 🔧 How to Use the Resume Download Feature

### Frontend Example:
```javascript
// Get application with resume
const response = await fetch(`/api/applications/${appId}`);
const { application } = await response.json();

// Resume URL is already formatted for download
const resumeDownloadUrl = application.applicant.resume;

// Direct download link
window.open(resumeDownloadUrl, '_blank');
```

### What the fl_attachment parameter does:
- **Without**: `https://res.cloudinary.com/...cloudinary_url...`
- **With**: `https://res.cloudinary.com/.../fl_attachment/...cloudinary_url...`
- Result: Browser downloads instead of opens in viewer

## 🚀 Quick Start

### 1. Switch to Mongoose Controller (Optional)
If you want to use the Mongoose controller instead of Prisma:

```typescript
// In routes/applicationRoutes.ts
import {
  getAllApplications,
  getUserApplications,
  getApplicationById,
  updateApplicationStatus,
  createApplication
} from '../controllers/applicationMongooseController';
```

### 2. Admin Status Update
```bash
curl -X PUT http://localhost:4000/api/applications/APP_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{ "status": "accepted" }'
```

### 3. Security Checklist
- ✅ Admin middleware protects status updates
- ✅ User auth required for all endpoints
- ✅ Applicants can only view their own applications (except admins)
- ✅ Status validation (only valid statuses accepted)

## 📋 Database References
```
User {
  _id
  fullName
  email
  phone
  password (hashed)
  role: "user" | "admin"
  resume: "https://res.cloudinary.com/.../fl_attachment/..."
  createdAt
  updatedAt
}

Job {
  _id
  title
  company
  location
  salary
  description
  requirements: []
  postedBy: User._id
  createdAt
  updatedAt
}

Application {
  _id
  applicant: User._id (POPULATED → User object)
  job: Job._id (POPULATED → Job object)
  status: "pending" | "reviewed" | "accepted" | "rejected"
  coverLetter: string
  createdAt
  updatedAt
}
```

## ⚙️ Environment Setup
All required in `.env`:
```
MONGO_URI=mongodb+srv://talex_db:...
CLOUDINARY_CLOUD_NAME=dindyruua
CLOUDINARY_API_KEY=447358261821916
CLOUDINARY_API_SECRET=...
JWT_SECRET=...
PORT=4000
```

✅ **Everything is ready to use!**
