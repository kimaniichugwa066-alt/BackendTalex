# 📄 Offer Letter PDF Generator - Complete Setup

## ✅ **What's Been Implemented**

### 1. **PDF Generator Utility** ✓
File: [src/utils/generateOfferLetter.ts](src/utils/generateOfferLetter.ts)

**Features:**
- ✅ Professional offer letter design
- ✅ Company branding (Talex)
- ✅ Application details auto-populated
- ✅ Terms & conditions included
- ✅ Signature section
- ✅ Footer with validity period

**What's Included in PDF:**
```
┌─────────────────────────────────┐
│      OFFER LETTER HEADER        │
│   Talex Recruitment System      │
├─────────────────────────────────┤
│ ✓ Date issued                   │
│ ✓ Application ID                │
│                                 │
│ ✓ Applicant name (greeting)     │
│ ✓ Position title                │
│ ✓ Company name                  │
│ ✓ Location                      │
│ ✓ Employment type               │
│ ✓ Start date                    │
│                                 │
│ ✓ Terms & Conditions (6 items)  │
│ ✓ Closing statement             │
│ ✓ Signature section             │
│ ✓ Footer & copyright            │
└─────────────────────────────────┘
```

### 2. **API Endpoint - Download Offer Letter** ✓
File: [src/routes/applicationRoutes.ts](src/routes/applicationRoutes.ts)

**Endpoint:**
```
GET /applications/:id/offer-letter
```

**Requirements:**
- Admin access only (adminOnly middleware)
- Authenticated user (authMiddleware)
- Valid application ID

**Security:**
- ✅ Admin-only access
- ✅ JWT authentication required
- ✅ Application must exist

**Response:**
- HTTP Header: `Content-Type: application/pdf`
- Download: `offer-letter-{applicationId}.pdf`
- Status: `200 OK` or `404 Not Found`

---

## 🚀 **How to Use**

### **1. Generate & Download Offer Letter**

```bash
curl -X GET http://localhost:4000/api/applications/APPLICATION_ID/offer-letter \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -o offer-letter.pdf
```

**In JavaScript/Frontend:**
```javascript
// Download offer letter as PDF
const downloadOfferLetter = async (appId, token) => {
  const response = await fetch(
    `http://localhost:4000/api/applications/${appId}/offer-letter`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `offer-letter-${appId}.pdf`;
    a.click();
  }
};

// Usage
downloadOfferLetter('507f1f77bcf86cd799439011', token);
```

### **2. Use Case: Admin Accepts Application**

**Step 1:** Admin updates application status to "accepted"
```bash
curl -X PUT http://localhost:4000/api/applications/APP_ID/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"status":"accepted"}'
```
→ Email sent to applicant

**Step 2:** Admin downloads offer letter
```bash
curl -X GET http://localhost:4000/api/applications/APP_ID/offer-letter \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -o offer-letter.pdf
```
→ PDF downloaded to local machine

**Step 3:** Admin manually sends/archives offer letter

---

## 📋 **PDF Content Breakdown**

### **Header Section**
```
[CENTERED] OFFER LETTER
━━━━━━━━━━━━━━━━━━━━━━
Talex Recruitment System
Your Gateway to Career Opportunities
```

### **Meta Information**
```
Date: [Current Date]
Application ID: [Auto-populated from DB]
```

### **Greeting**
```
Dear [Applicant Name],
```

### **Job Details Box**
```
┌─────────────────────────────┐
│ Position Title: [Job Title] │
│ Company: [Job Company]      │
│ Location: [Job Location]    │
│ Employment Type: Full-time  │
│ Start Date: To be comm...   │
└─────────────────────────────┘
```

### **Terms & Conditions**
- Background verification required
- Document verification required
- Valid ID/passport required
- Company policies compliance
- Confidentiality maintenance
- Medical clearance (if applicable)

### **Signature Section**
```
Sincerely,

_________________________

HR Department
Talex Recruitment System
```

### **Footer**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Valid for 14 days from issue date
© 2026 Talex Recruitment System
```

---

## ⚙️ **Installation & Setup**

✅ **PDFKit installed**: `npm install pdfkit`

**Environment ready:**
- MongoDB configured
- JWT authentication active
- Admin middleware in place

---

## 🔒 **Security & Access Control**

### **Route Protection Stack:**
```
1. authMiddleware      → Verify JWT token
2. adminOnly           → Ensure admin role
3. Application.findById → Verify application exists
4. PDF generation      → Create document
5. Download response   → Send to admin
```

### **Access Matrix:**
| User Role | Can Download |
|-----------|-------------|
| Guest | ❌ No |
| User | ❌ No |
| Admin | ✅ Yes |

---

## 📊 **Data Flow**

```
Admin Request
    ↓
GET /applications/:id/offer-letter
    ↓
authMiddleware (verify JWT)
    ↓
adminOnly (verify admin role)
    ↓
Application.findById (get data)
    ↓
Populate applicant & job
    ↓
createOfferLetter (generate PDF)
    ↓
doc.pipe(res) (stream to browser)
    ↓
Browser Downloads: offer-letter-{id}.pdf
```

---

## 🐛 **Troubleshooting**

### **PDF not downloading?**
✅ Verify admin token is valid
✅ Verify application ID exists
✅ Check Content-Disposition header

### **Content not showing?**
✅ PDF font is available (using built-in fonts)
✅ Data is properly populated from DB
✅ No encoding issues

### **404 Error?**
✅ Application ID is correct
✅ Application exists in database
✅ Application has valid applicant & job references

---

## 📚 **API Summary**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/applications/all` | GET | Admin | List all applications |
| `/applications/user` | GET | User | List user's applications |
| `/applications/:id` | GET | User | Get single application |
| `/applications/:id/status` | PUT | Admin | Update status + send email |
| `/applications/:id/offer-letter` | GET | Admin | Download offer letter PDF |

---

## ✅ **Feature Checklist**

- [x] PDF library installed (pdfkit)
- [x] Offer letter generator created
- [x] Professional template designed
- [x] API endpoint added
- [x] Admin-only protection
- [x] Error handling
- [x] Proper response headers
- [x] Download functionality

**Ready to generate offer letters! 🎉**
