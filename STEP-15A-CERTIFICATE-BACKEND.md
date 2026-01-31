# STEP-15A: Certificate Generation (Backend)

## 📋 Overview

Certificate generation is the final touch for your LMS. Students can download a professional PDF certificate when they complete a course.

**This step is BACKEND ONLY** - Generate certificates on the server using PDFKit.

---

## ✅ What You Now Have

### Files Created
1. **`backend/routes/certificate.js`** - Certificate generation route
2. **Updated `backend/server.js`** - Added certificate route to app
3. **Updated `backend/package.json`** - Added PDFKit dependency

### Files Modified
- `server.js` - Added certificate route import and middleware
- `package.json` - Added pdfkit dependency

---

## 🚀 Installation

### Step 1: Install PDFKit

```bash
cd backend
npm install
```

PDFKit is already added to `package.json`, so `npm install` will fetch it automatically.

### Step 2: Verify Installation

Check if pdfkit is installed:
```bash
npm list pdfkit
```

You should see: `pdfkit@0.13.0` or similar

---

## 📖 How It Works

### Route Details

**Endpoint:**
```
GET /api/certificate/course/:courseId
```

**Protected:** ✅ Yes (requires authentication)
**Role Required:** student
**Parameters:**
- `courseId` - from URL params
- `studentId` - from authenticated user

### Flow

1. **Authentication Check**
   - Verify user has valid JWT token
   - Extract userId from token

2. **Role Check**
   - Verify user is a student
   - Deny access if not a student

3. **Fetch Data**
   - Get course details
   - Get student details
   - Get all lectures in course
   - Get watch time records for student

4. **Calculate Completion**
   - Count total lectures in course
   - Count lectures watched by student
   - Calculate completion percentage

5. **Verify Completion**
   - Check if completionPercent == 100%
   - Return error if less than 100%

6. **Generate PDF**
   - Create PDF document
   - Add certificate design
   - Add student name
   - Add course title
   - Add completion date

7. **Send Response**
   - Set PDF headers
   - Pipe PDF to response
   - Browser downloads file

---

## 💻 Code Walkthrough

### Certificate Route Structure

```javascript
router.get(
  '/course/:courseId',
  authMiddleware,           // Check authentication
  roleMiddleware('student'), // Check role is student
  async (req, res) => {
    // Handler logic
  }
);
```

### Main Steps in Handler

#### 1. Extract Data
```javascript
const courseId = req.params.courseId;
const studentId = req.user.id; // From token
```

#### 2. Fetch Details
```javascript
const course = await Course.findById(courseId);
const student = await User.findById(studentId);
```

#### 3. Calculate Completion
```javascript
const allLectures = await Lecture.find({ courseId });
const watchedRecords = await WatchTime.find({ studentId, lectureId: {...} });
const completionPercent = (watchedRecords.length / allLectures.length) * 100;
```

#### 4. Verify 100% Complete
```javascript
if (completionPercent < 100) {
  return res.status(400).json({
    message: 'Complete the course to generate certificate'
  });
}
```

#### 5. Create PDF
```javascript
const doc = new PDFDocument({ size: 'A4', margin: 50 });
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename="certificate.pdf"');
doc.pipe(res);
```

#### 6. Design Certificate
```javascript
doc.fontSize(36).text('Certificate of Completion', { align: 'center' });
doc.fontSize(24).text(student.name, { align: 'center', underline: true });
doc.fontSize(16).text(course.title, { align: 'center' });
doc.text(`Completed on: ${formattedDate}`, { align: 'center' });
```

#### 7. Send to Client
```javascript
doc.end(); // Finish PDF and send
```

---

## 🎨 Certificate Design

The generated certificate includes:

```
┌─────────────────────────────────────────┐
│      CERTIFICATE OF COMPLETION          │
│                                         │
│          This is to certify that        │
│                                         │
│         *** Student Name ***            │
│                                         │
│    has successfully completed the       │
│                                         │
│         *** Course Title ***            │
│                                         │
│     Completed on: January 27, 2026      │
│                                         │
│  This certificate is awarded in...      │
└─────────────────────────────────────────┘
```

**Design Features:**
- Professional centered layout
- Decorative borders (top and bottom)
- Student name underlined
- Course title italicized
- Formatted completion date
- Footer text
- A4 size (standard)

---

## 🧪 Testing with Postman

### Prerequisites
1. Student must be enrolled in course
2. Student must watch 100% of lectures
3. You need valid JWT token

### Test Steps

#### Step 1: Login as Student
```
POST /api/auth/login
Body:
{
  "email": "student@example.com",
  "password": "password123"
}
```

Save the `token` from response.

#### Step 2: Generate Certificate
```
GET /api/certificate/course/:courseId

Headers:
Authorization: Bearer <token>
```

Replace `:courseId` with actual course ID.

#### Step 3: Expected Responses

**Success (200):**
```
[Binary PDF file downloads]
```

**Course Not Complete (400):**
```json
{
  "message": "Complete the course to generate certificate",
  "completionPercent": 75,
  "required": 100
}
```

**Not Authenticated (401):**
```json
{
  "message": "Access denied. No token provided."
}
```

**Not a Student (403):**
```json
{
  "message": "Access denied. Only student can access this."
}
```

---

## 🔍 Code Explanations

### Why Check 100% Completion?
```javascript
if (completionPercent < 100) {
  return res.status(400).json({
    message: 'Complete the course to generate certificate'
  });
}
```

**Reason:** Only fully completed courses should have certificates. This ensures certificate credibility.

### Why Use `doc.pipe(res)`?
```javascript
doc.pipe(res);
```

**Reason:** Pipes the PDF stream directly to HTTP response. More efficient than saving to disk first.

### Why Set Response Headers?
```javascript
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename="certificate.pdf"');
```

**Reason:** 
- `Content-Type` tells browser it's a PDF
- `Content-Disposition` tells browser to download (not display)
- `filename` sets the download name

### Why Use `authMiddleware` + `roleMiddleware`?
```javascript
router.get(
  '/course/:courseId',
  authMiddleware,
  roleMiddleware('student'),
  ...
)
```

**Reason:** 
- `authMiddleware` ensures user is logged in
- `roleMiddleware` ensures user is a student (not teacher/admin)
- Protects endpoint from unauthorized access

---

## 📊 Data Flow Diagram

```
Student Request
    ↓
GET /api/certificate/course/:courseId
    ↓
authMiddleware ─→ Verify JWT Token
    ↓
roleMiddleware ─→ Check role === 'student'
    ↓
Fetch Course Details
    ↓
Fetch Student Details
    ↓
Count Total Lectures
    ↓
Count Watched Lectures
    ↓
Calculate Completion %
    ↓
Is completionPercent === 100%?
    ├─→ No (< 100%)  ─→ Return 400 Error
    │
    └─→ Yes (100%)   ─→ Generate PDF
                           ↓
                      Add Certificate Content
                           ↓
                      Set PDF Headers
                           ↓
                      Pipe to Response
                           ↓
                      Browser Downloads PDF
```

---

## 🛠️ Troubleshooting

### Problem: "Cannot find module 'pdfkit'"

**Solution:**
```bash
cd backend
npm install
```

### Problem: PDF generated but won't download

**Check:**
- Headers are set correctly
- `doc.pipe(res)` is called
- `doc.end()` is called at the end

### Problem: Certificate shows but no student name

**Check:**
- Student exists in database
- `User.findById(studentId)` returns result
- `student.name` field is populated

### Problem: Completion percent always less than 100%

**Check:**
- Student has watched all lectures
- `WatchTime` records exist
- All lectures are added to course
- Calculation logic: `(watched / total) * 100`

---

## 📝 Key Files

### `routes/certificate.js`
- Main certificate generation logic
- Uses PDFKit for PDF creation
- Checks completion status
- Returns PDF or error

### `server.js`
- Imports certificate routes
- Mounts certificate route at `/api/certificate`

### `package.json`
- Added `pdfkit: ^0.13.0` dependency

---

## 🎓 Learning Points

### 1. PDFKit Basics
```javascript
const doc = new PDFDocument();
doc.fontSize(24).text('Hello');
doc.pipe(response);
doc.end();
```

### 2. Middleware Chaining
```javascript
router.get(
  '/path',
  middleware1, // Runs first
  middleware2, // Runs second
  async (req, res) => { ... } // Runs third
);
```

### 3. Response Streaming
```javascript
doc.pipe(res); // Stream PDF to response
// More efficient than loading entire PDF in memory
```

### 4. Role-Based Access
```javascript
roleMiddleware('student') // Only allows students
// Prevents teachers/admins from accessing
```

---

## ✨ Features

✅ **Simple Implementation** - Easy to understand code  
✅ **Secure** - Protected by authentication and role checks  
✅ **Efficient** - Streams PDF (doesn't load in memory)  
✅ **Professional** - Clean certificate design  
✅ **Beginner-Friendly** - Well commented code  
✅ **No Disk Storage** - Sends PDF directly to client  

---

## 🚀 Next Step

After backend is complete:
- STEP-15B will add frontend button to download certificate
- Students can download certificate after course completion

---

## 📞 Summary

| Item | Details |
|------|---------|
| **Route** | `GET /api/certificate/course/:courseId` |
| **Auth Required** | ✅ Yes |
| **Role Required** | student |
| **Returns** | PDF file |
| **Completion Check** | 100% required |
| **Libraries** | PDFKit |
| **File Created** | `routes/certificate.js` |

---

**Status:** ✅ COMPLETE
**Backend:** Ready
**Next:** STEP-15B (Frontend integration)

---

Date: January 27, 2026
STEP-15A: Certificate Generation Backend
