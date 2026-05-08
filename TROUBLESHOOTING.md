# 🔧 Frontend Troubleshooting Guide - BackendTalex

Common issues frontend developers encounter and how to fix them.

---

## 🔑 Authentication Issues

### ❌ "Invalid email format"

**Problem**: Email validation is failing even though the email looks valid.

**Root Cause**: Email must be in valid format `user@domain.extension`

**Solution**:
```javascript
// ❌ Wrong
"email": "john@example"          // Missing .com
"email": "john.example.com"      // Missing @
"email": "john @example.com"     // Contains space

// ✅ Correct
"email": "john@example.com"
"email": "user.name@company.co.uk"
```

---

### ❌ "Password must be at least 8 characters with uppercase, number, and special character"

**Problem**: Password validation failing for various reasons.

**Requirements**:
- ✅ Minimum 8 characters
- ✅ At least one UPPERCASE letter
- ✅ At least one number (0-9)
- ✅ At least one special character (@$!%*?&)

**Solution**:
```javascript
// ❌ Wrong Passwords
"password": "pass1234"           // No uppercase, no special char
"password": "Password123"        // No special character
"password": "Pass@"             // Too short
"password": "PASSWORD@"         // No number

// ✅ Correct Passwords
"password": "MyPass123!"
"password": "SecurePass@456"
"password": "Complex$Pass789"
"password": "Admin@2026"
```

---

### ❌ "Invalid phone number. Use format: +[country code][number] or [10-15 digits]"

**Problem**: Phone validation is too strict or too loose.

**Before Fix**: Only accepted Kenya format (❌ Not international)
**After Fix**: Accepts international format (✅ Global support)

**Valid Formats**:
```javascript
// ✅ With country code
"+254798989881"     // Kenya
"+1234567890"       // USA/Canada
"+447911123456"     // UK
"+33612345678"      // France

// ✅ Without country code (10-15 digits)
"0798989881"
"1234567890"

// ❌ Invalid formats
"798989881"         // Too short
"254798989881"      // Without + and too long
"254-798-989-881"   // Contains dashes
"+25479898988"      // Too short
```

---

### ❌ "Token has expired"

**Problem**: Access token expired and requests are being rejected.

**Solution**: Use refresh token to get new access token

```javascript
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken;
  }
  
  // If refresh fails, logout user
  logout();
}
```

---

### ❌ "No authorization token provided"

**Problem**: API request made without access token.

**Solution**: Always include Authorization header

```javascript
// ❌ Wrong - No header
const response = await fetch('/api/profile');

// ✅ Correct - Include token in header
const token = localStorage.getItem('accessToken');
const response = await fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### ❌ "Email already exists"

**Problem**: Trying to register with an email that's already registered.

**Solution**:
```javascript
// Show error to user
// Ask user to either:
// 1. Use a different email
// 2. Login with existing email
// 3. Click "Forgot Password" if they forgot credentials
```

---

## 📱 Phone Number Issues

### ❌ "Invalid Kenyan phone number" (Old Validation)

This error is **FIXED** with the new validation rules. Old backend only accepted:
- `+254788123456` or `0788123456`

**New validation is international:**
- `+254788123456` ✅
- `+1234567890` ✅
- `+447911123456` ✅
- `0788123456` ✅

---

## 📝 Application Issues

### ❌ "Job not found"

**Problem**: Job ID doesn't exist or was deleted.

**Solution**:
```javascript
// Ensure job ID is correct
try {
  const job = await fetch(`/api/jobs/${jobId}`);
  if (!job.ok) throw new Error('Job not found');
} catch (error) {
  console.error('Job has been removed or is unavailable');
  // Show user-friendly message
}
```

---

### ❌ "You have already applied to this job"

**Problem**: User trying to apply twice to same job.

**Solution**: Check if already applied before showing apply button

```javascript
async function canUserApply(jobId) {
  const response = await fetch('/api/applications/user', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  const alreadyApplied = data.data.some(app => app.jobId === jobId);
  
  return !alreadyApplied;
}
```

---

## 💳 Payment Issues

### ❌ "STK push failed"

**Problem**: M-Pesa payment initiation failed.

**Causes**:
1. Invalid phone number format
2. Phone not linked to M-Pesa account
3. Network timeout
4. Safaricom server error

**Solution**:
```javascript
// Ensure correct phone format
const phone = "254798989881";  // Without +

// Try again after a delay
setTimeout(() => {
  retryPayment();
}, 3000);
```

---

### ❌ "Payment verification failed"

**Problem**: Payment seems processed but verification fails.

**Solution**:
```javascript
// Don't show "Payment failed" immediately
// Poll verification endpoint multiple times
async function verifyPaymentWithRetry(checkoutRequestId, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ checkoutRequestId })
    });
    
    const data = await response.json();
    if (data.data.status === 'completed') {
      return data.data;
    }
    
    // Wait before next attempt
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Payment verification timeout');
}
```

---

## 📤 File Upload Issues

### ❌ "No file uploaded"

**Problem**: Resume file wasn't included in request.

**Solution**:
```javascript
// ❌ Wrong - Sending JSON
const response = await fetch('/api/upload/upload-resume', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ resumeUrl: '...' })
});

// ✅ Correct - Using FormData
const formData = new FormData();
formData.append('resume', fileInputElement.files[0]);

const response = await fetch('/api/upload/upload-resume', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

---

### ❌ "File size too large"

**Problem**: Resume file exceeds size limit.

**Solution**:
```javascript
// Check file size before upload (max 10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const file = fileInputElement.files[0];
if (file.size > MAX_FILE_SIZE) {
  console.error('File too large. Max 10MB allowed.');
  return;
}
```

---

## 🔔 Notification Issues

### ❌ Notifications not appearing

**Problem**: User expecting notifications but not showing.

**Solution**:
```javascript
// Poll notifications periodically
useEffect(() => {
  const fetchNotifications = async () => {
    const response = await fetch('/api/notifications', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setNotifications(data.data);
  };
  
  // Fetch every 30 seconds
  const interval = setInterval(fetchNotifications, 30000);
  return () => clearInterval(interval);
}, [token]);
```

---

## 👤 Profile Issues

### ❌ "Name must be at least 2 characters"

**Problem**: Name validation too strict.

**Solution**:
```javascript
// ❌ Too short
"name": "J"

// ✅ Valid
"name": "Jo"
"name": "John Kimani"
```

---

## 🚨 Rate Limiting

### ❌ "Too many requests, please try again later"

**Problem**: Made too many API requests too quickly (429 error).

**Limits**: 120 requests per 15 minutes

**Solution**:
```javascript
// Implement request queue/throttling
import pLimit from 'p-limit';
const limit = pLimit(5); // Max 5 concurrent requests

// Or wait before retrying
const retryAfter = 900; // 15 minutes in seconds
setTimeout(() => {
  retryRequest();
}, retryAfter * 1000);
```

---

## 🔐 CORS Issues

### ❌ "No 'Access-Control-Allow-Origin' header"

**Problem**: Frontend domain not allowed by backend CORS policy.

**Current Setting**: Only `https://talex-one.vercel.app` is allowed

**Solution**:
- If you need access from different domain, contact backend team
- Or add domain to CORS whitelist in backend `.env`

```javascript
// Verify request is from allowed domain
// Backend is configured to accept only: https://talex-one.vercel.app
```

---

## 📊 Admin Issues

### ❌ "Admin privileges required"

**Problem**: Trying to access admin endpoint as regular user.

**Solution**:
```javascript
// Check user role before making admin calls
const user = getCurrentUser();

if (user.role !== 'admin') {
  console.error('This action requires admin privileges');
  return;
}

// Now make admin API call
const response = await fetch('/api/admin/dashboard', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🐛 Debugging Tips

### 1. Check Console for Errors
```javascript
// Always log API responses
fetch(url).then(res => {
  console.log('Status:', res.status);
  return res.json();
}).then(data => {
  console.log('Response:', data);
});
```

### 2. Inspect Network Requests
- Open DevTools → Network tab
- Look for failed requests (red)
- Check response status and data
- Verify headers include Authorization

### 3. Verify Token Validity
```javascript
// Decode JWT token to see contents
function decodeToken(token) {
  const parts = token.split('.');
  const payload = atob(parts[1]);
  return JSON.parse(payload);
}

const decoded = decodeToken(localStorage.getItem('accessToken'));
console.log('Token expires at:', new Date(decoded.exp * 1000));
```

### 4. Test with cURL
```bash
# Test login
curl -X POST https://api.talex.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123!"}'

# Test profile (replace TOKEN)
curl -X GET https://api.talex.com/api/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## ✅ Common Solutions Checklist

- [ ] Token included in Authorization header?
- [ ] Using `Bearer ${token}` format?
- [ ] Email in valid format (user@domain.com)?
- [ ] Password has uppercase, number, special char?
- [ ] Phone has 10-15 digits (international format)?
- [ ] File upload using FormData (not JSON)?
- [ ] Handling token expiry with refresh?
- [ ] Checking user role for admin endpoints?
- [ ] Making requests from allowed domain?
- [ ] Request within rate limit (120/15min)?

---

## 📞 Getting Help

If you can't resolve an issue:

1. **Check this guide** for common solutions
2. **Check API documentation** at `FRONTEND_API_GUIDE.md`
3. **Review error response** carefully - it usually explains the issue
4. **Contact support**: support@talex.com

Include in your report:
- API endpoint you're calling
- Full error message
- Request body (without sensitive data)
- Your frontend framework/library
- Browser console errors
- Network tab screenshot

---

**Last Updated**: May 8, 2026
**API Version**: 1.0
