# 📚 Frontend Developer Documentation Index

**Welcome Frontend Developers!** This is your complete guide to integrating with the BackendTalex API.

---

## 🚀 Start Here

### Just Getting Started?
→ Read **[FRONTEND_GETTING_STARTED.md](FRONTEND_GETTING_STARTED.md)** first
- Project setup instructions
- Step-by-step integration guide
- Basic folder structure
- How to run locally

### Want to See Code Examples?
→ Jump to **[FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md)**
- Ready-to-use React components
- Service layer examples
- Custom hooks
- API wrapper utilities

---

## 📖 Documentation Guide

### 1. **[FRONTEND_API_GUIDE.md](FRONTEND_API_GUIDE.md)** - 📋 Complete Reference
**For**: When you need detailed API documentation
- All 40+ API endpoints listed
- Request/response examples for each
- Error codes and status codes
- Authentication patterns
- Admin endpoints
- Frontend integration examples

**Read if**:
- You need detailed documentation for an endpoint
- You want examples for a specific feature
- You're integrating a new module

**Quick nav**:
- [Authentication Endpoints](FRONTEND_API_GUIDE.md#-authentication)
- [Jobs Endpoints](FRONTEND_API_GUIDE.md#-jobs)
- [Applications Endpoints](FRONTEND_API_GUIDE.md#-applications)
- [Profile Endpoints](FRONTEND_API_GUIDE.md#-profile)
- [Payments (M-Pesa)](FRONTEND_API_GUIDE.md#-payments-mpesa)
- [Notifications](FRONTEND_API_GUIDE.md#-notifications)
- [Support Requests](FRONTEND_API_GUIDE.md#-support-requests)
- [File Upload](FRONTEND_API_GUIDE.md#-file-upload)
- [Admin Panel](FRONTEND_API_GUIDE.md#-admin-panel)

---

### 2. **[API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md)** - ⚡ Fast Lookup
**For**: When you just need endpoint information quickly

| What | Found Here |
|------|-----------|
| All endpoints in one table | ✅ Yes |
| HTTP methods | ✅ Yes |
| Authentication required? | ✅ Yes (✅👑) |
| Validation rules | ✅ Yes |
| HTTP status codes | ✅ Yes |
| Example cURL commands | ✅ Yes |

**Read if**:
- You need to find an endpoint quickly
- You want a one-page reference
- You're in a hurry

**Contains**:
- 60+ endpoints organized by feature
- Legend explaining symbols
- Common validation rules
- Typical query parameters

---

### 3. **[FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md)** - 💻 Working Code
**For**: Copy-paste ready code snippets

**Includes**:
- React Custom Hooks (useAuth)
- Service Classes (Auth, Jobs, Applications, etc.)
- React Components (LoginForm, JobList, ApplyModal, etc.)
- Error handling patterns
- Payment examples
- File upload examples
- API wrapper with auto-refresh
- Environment setup

**Read if**:
- You're building a feature
- You want code examples for best practices
- You prefer learning by example
- You need React component templates

**Example snippets**:
- LoginForm component
- Job listing component
- Application submit form
- M-Pesa payment integration
- Resume upload component
- Profile editor
- useAuth custom hook

---

### 4. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - 🔧 Problem Solving
**For**: When something isn't working

**Common Issues Covered**:
- ❌ "Invalid email format"
- ❌ "Invalid phone number"
- ❌ "Password validation failed"
- ❌ "Token expired"
- ❌ "No authorization token"
- ❌ "CORS error"
- ❌ "File upload failed"
- ❌ "Admin privileges required"
- ❌ "Rate limit exceeded"

**Read if**:
- You're getting an error
- Something's not working as expected
- You need debugging tips
- You want to understand validation rules

**Contains**:
- Root cause analysis for each issue
- Step-by-step solutions
- Code examples to fix issues
- Debugging tips
- Checklist for common problems

---

### 5. **[FRONTEND_GETTING_STARTED.md](FRONTEND_GETTING_STARTED.md)** - 🎯 Setup Guide
**For**: Initial project setup and basic integration

**Covers**:
- Project setup (React, Vite)
- Environment configuration
- API service setup
- Authentication context
- Routing setup
- Basic components
- Styling
- Development server
- Validation rules reference

**Read if**:
- You're starting a new frontend project
- You need setup instructions
- You want best practices for architecture
- You're new to the team

---

## 🎯 Find What You Need

### By Task

**I want to...**

| Task | Document | Link |
|------|----------|------|
| Start a new project | Getting Started | [FRONTEND_GETTING_STARTED.md](FRONTEND_GETTING_STARTED.md) |
| Build a login form | Code Examples | [FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md#react-component---login-form) |
| List all jobs | Code Examples | [FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md#react-component---job-list) |
| Implement payments | Code Examples | [FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md#-payment-examples) |
| Upload a file | Code Examples | [FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md#-file-upload-examples) |
| Understand an endpoint | API Guide | [FRONTEND_API_GUIDE.md](FRONTEND_API_GUIDE.md) |
| Find an endpoint quickly | Quick Reference | [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md) |
| Fix an error | Troubleshooting | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| See all endpoints | Quick Reference | [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md) |
| Use React hooks | Code Examples | [FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md#react-hook---useauth) |

---

### By Error

**I'm getting an error...**

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid email format" | Email format wrong | [TROUBLESHOOTING.md](TROUBLESHOOTING.md#-invalid-email-format) |
| "Invalid phone number" | Phone format wrong | [TROUBLESHOOTING.md](TROUBLESHOOTING.md#-invalid-phone-number) |
| "Password failed validation" | Password too weak | [TROUBLESHOOTING.md](TROUBLESHOOTING.md#-password-must-be-at-least-8) |
| "Token expired" | JWT expired | [TROUBLESHOOTING.md](TROUBLESHOOTING.md#-token-has-expired) |
| "No auth token" | Not included in header | [TROUBLESHOOTING.md](TROUBLESHOOTING.md#-no-authorization-token) |
| "File upload failed" | Wrong format/size | [TROUBLESHOOTING.md](TROUBLESHOOTING.md#-file-upload-issues) |
| "CORS error" | Domain not allowed | [TROUBLESHOOTING.md](TROUBLESHOOTING.md#-cors-issues) |
| "Admin privileges" | Not an admin user | [TROUBLESHOOTING.md](TROUBLESHOOTING.md#-admin-privileges-required) |
| "Too many requests" | Rate limit exceeded | [TROUBLESHOOTING.md](TROUBLESHOOTING.md#-rate-limiting) |

---

### By API Feature

**I'm working with...**

| Feature | Quick Ref | Full Docs | Code Examples |
|---------|-----------|-----------|---|
| Authentication | [🔐 Auth](API_QUICK_REFERENCE.md#-authentication) | [View](FRONTEND_API_GUIDE.md#-authentication) | [View](FRONTEND_CODE_EXAMPLES.md#-authentication-examples) |
| Jobs | [💼 Jobs](API_QUICK_REFERENCE.md#-jobs) | [View](FRONTEND_API_GUIDE.md#-jobs) | [View](FRONTEND_CODE_EXAMPLES.md#-jobs-examples) |
| Applications | [📝 Apps](API_QUICK_REFERENCE.md#-applications) | [View](FRONTEND_API_GUIDE.md#-applications) | [View](FRONTEND_CODE_EXAMPLES.md#-applications-examples) |
| Profile | [👤 Profile](API_QUICK_REFERENCE.md#-profile) | [View](FRONTEND_API_GUIDE.md#-profile) | [View](FRONTEND_CODE_EXAMPLES.md#-profile-examples) |
| Payments | [💳 Payments](API_QUICK_REFERENCE.md#-payments) | [View](FRONTEND_API_GUIDE.md#-payments-mpesa) | [View](FRONTEND_CODE_EXAMPLES.md#-payment-examples) |
| Notifications | [🔔 Notif](API_QUICK_REFERENCE.md#-notifications) | [View](FRONTEND_API_GUIDE.md#-notifications) | N/A |
| Support | [💬 Support](API_QUICK_REFERENCE.md#-support) | [View](FRONTEND_API_GUIDE.md#-support-requests) | N/A |
| Upload | [📤 Upload](API_QUICK_REFERENCE.md#-file-upload) | [View](FRONTEND_API_GUIDE.md#-file-upload) | [View](FRONTEND_CODE_EXAMPLES.md#-file-upload-examples) |
| Admin | [👨‍💼 Admin](API_QUICK_REFERENCE.md#-admin-only) | [View](FRONTEND_API_GUIDE.md#-admin-panel) | N/A |

---

## 📞 Quick Reference Cards

### ✅ Validation Rules

| Field | Rules | Examples |
|-------|-------|----------|
| **Email** | Valid format (user@domain.com) | ✅ john@example.com |
| **Phone** | +[code][10-15 digits] | ✅ +254798989881 |
| **Password** | 8+ chars, uppercase, number, special | ✅ MyPass123! |
| **Name** | 2-100 characters | ✅ John Kimani |

### 🔑 Authentication

```
1. Register → POST /auth/register
2. Get tokens → In response
3. Store tokens → localStorage
4. Include token → Authorization: Bearer {token}
5. Token expires? → POST /auth/refresh
6. Still invalid? → Logout and login again
```

### 🚨 Error Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200-201 | ✅ Success | Continue |
| 400 | ❌ Bad request | Check input validation |
| 401 | ❌ Unauthorized | Refresh or login |
| 403 | ❌ Forbidden | Need admin role |
| 404 | ❌ Not found | Check ID/endpoint |
| 429 | ❌ Rate limited | Wait 15 minutes |
| 500 | ❌ Server error | Retry or contact support |

---

## 🛠️ Common Development Tasks

### Task 1: Create Login Page
1. Read [FRONTEND_GETTING_STARTED.md](FRONTEND_GETTING_STARTED.md#️-step-5-setup-routing)
2. Copy LoginPage component from [FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md#react-component---login-form)
3. Use useAuth hook from [FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md#react-hook---useauth)

### Task 2: Display Jobs List
1. Reference endpoint: [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md#-jobs)
2. Detailed docs: [FRONTEND_API_GUIDE.md#jobs](FRONTEND_API_GUIDE.md#-jobs)
3. Code example: [FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md#react-component---job-list)

### Task 3: Implement Job Application
1. Reference endpoint: [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md#-applications)
2. Response format: [FRONTEND_API_GUIDE.md#applications](FRONTEND_API_GUIDE.md#-applications)
3. Component code: [FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md#react-component---apply-for-job)

### Task 4: Add M-Pesa Payment
1. API documentation: [FRONTEND_API_GUIDE.md#payments](FRONTEND_API_GUIDE.md#-payments-mpesa)
2. Service code: [FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md#service---payment-service)
3. Component: [FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md#react-component---payment-modal)

### Task 5: Debug an Error
1. Check status code in [TROUBLESHOOTING.md](TROUBLESHOOTING.md#-common-issues)
2. Find error message in relevant section
3. Apply solution
4. Use debugging tips from [TROUBLESHOOTING.md](TROUBLESHOOTING.md#-debugging-tips)

---

## 📊 Document Statistics

| Document | Size | Purpose | Sections |
|----------|------|---------|----------|
| FRONTEND_GETTING_STARTED.md | Large | Setup guide | 8 steps |
| FRONTEND_API_GUIDE.md | Very Large | Complete reference | 10 modules |
| API_QUICK_REFERENCE.md | Small | Quick lookup | Endpoint tables |
| FRONTEND_CODE_EXAMPLES.md | Large | Code samples | 10+ examples |
| TROUBLESHOOTING.md | Large | Problem solving | 10+ issues |

---

## 💡 Pro Tips

1. **Bookmark This Index** - You'll come back often
2. **Search in GitHub** - Use Ctrl+F to search within files
3. **Copy Code Carefully** - Adapt examples to your needs
4. **Read Error Messages** - Backend sends helpful error details
5. **Check Validation Rules** - Most errors are validation issues
6. **Use Vue/Angular?** - Code patterns work, just adjust syntax
7. **Keep Tokens Safe** - localStorage is okay for MVP, use secure storage for production
8. **Test with Postman** - Before building frontend

---

## 🎓 Learning Path

**Never used this API before?**

1. ✅ Start with [FRONTEND_GETTING_STARTED.md](FRONTEND_GETTING_STARTED.md) - 20 mins
2. ✅ Look at code examples in [FRONTEND_CODE_EXAMPLES.md](FRONTEND_CODE_EXAMPLES.md) - 30 mins
3. ✅ Build your first component using login form example - 30 mins
4. ✅ Reference [FRONTEND_API_GUIDE.md](FRONTEND_API_GUIDE.md) as needed - ongoing
5. ✅ Use [TROUBLESHOOTING.md](TROUBLESHOOTING.md) when stuck - as needed

**Total onboarding time**: ~2-3 hours

---

## 🤝 Contributing

Found an issue or have a suggestion?

1. Check if it's already documented
2. If not, file an issue with:
   - Error message
   - What you were trying to do
   - Environment (React version, Node version, etc.)
   - Screenshot if possible

---

## 📋 Checklist Before Starting

- [ ] Read [FRONTEND_GETTING_STARTED.md](FRONTEND_GETTING_STARTED.md)
- [ ] Bookmark this index
- [ ] Save API endpoint reference locally
- [ ] Set up .env.local with backend URL
- [ ] Review validation rules
- [ ] Read one code example
- [ ] Error handling strategy understood

---

## ✅ Quick Links Summary

| Document | Use for | Time to read |
|----------|---------|--------------|
| [This Index](./FRONTEND_DOCUMENTATION_INDEX.md) | Navigation | 5 mins |
| [Getting Started](FRONTEND_GETTING_STARTED.md) | Initial setup | 20 mins |
| [Code Examples](FRONTEND_CODE_EXAMPLES.md) | Real code | 30 mins |
| [API Reference](FRONTEND_API_GUIDE.md) | Details | Reference |
| [Quick Ref](API_QUICK_REFERENCE.md) | Quick lookup | 2 mins |
| [Troubleshooting](TROUBLESHOOTING.md) | Debug issues | 10 mins |

---

**Last Updated**: May 8, 2026
**Status**: Complete and ready for use
**Questions?** Check the relevant document first, then contact support@talex.com
