# STEP-15A: Quick Start - Certificate Backend

## ⚡ 5-Minute Setup

### 1. Install PDFKit
```bash
cd backend
npm install
```

### 2. Files Already Created ✅
- `routes/certificate.js` - Certificate route
- `server.js` - Updated with route
- `package.json` - Added pdfkit

### 3. Start Backend
```bash
npm run dev
```

---

## 🧪 Quick Test

### Using Postman

**1. Login (Get Token)**
```
POST http://localhost:5000/api/auth/login
Body: { "email": "student@example.com", "password": "password123" }
```

**2. Get Certificate**
```
GET http://localhost:5000/api/certificate/course/{courseId}
Header: Authorization: Bearer {token}
```

**3. Expected Results**
- ✅ PDF downloads if course is 100% complete
- ❌ 400 error if course not complete
- ❌ 401 if no token
- ❌ 403 if not a student

---

## 📝 Code Location

```
backend/
├── routes/
│   └── certificate.js        ← NEW
├── server.js                 ← UPDATED
└── package.json              ← UPDATED
```

---

## 🔧 What Each File Does

### `certificate.js`
```javascript
GET /api/certificate/course/:courseId
├── Check authentication (authMiddleware)
├── Check role is student (roleMiddleware)
├── Fetch course & student details
├── Calculate completion %
├── If 100% → Generate PDF
├── Else → Return error
└── Send PDF to client
```

### `server.js`
```javascript
// Added these lines:
const certificateRoutes = require('./routes/certificate');
app.use('/api/certificate', certificateRoutes);
```

### `package.json`
```javascript
// Added to dependencies:
"pdfkit": "^0.13.0"
```

---

## 🎯 Key Features

✅ **Protected** - Only authenticated students  
✅ **Smart** - Only generates if 100% complete  
✅ **Professional** - Clean PDF design  
✅ **Simple** - Easy to understand code  
✅ **No Files** - PDF sent directly to client  

---

## 🚨 Common Issues

| Problem | Solution |
|---------|----------|
| PDFKit not found | Run `npm install` |
| 401 error | Add token to Authorization header |
| 403 error | Make sure user is a student |
| 400 error | Complete course first (100%) |

---

## ✨ What's Next?

STEP-15B will add:
- Button to download certificate
- Frontend integration
- User experience

---

**Status:** ✅ Backend Complete  
**Next:** STEP-15B Frontend Integration
