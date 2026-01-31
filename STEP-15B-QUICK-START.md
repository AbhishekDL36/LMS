# STEP-15B: Quick Start - Certificate Frontend

## ⚡ 5-Minute Verification

### 1. Check File Updated ✅
```
File: frontend/src/pages/ProgressDashboard.jsx
Status: Updated with certificate download
Lines Added: ~120
```

### 2. New Features Added
```
✅ Certificate download button
✅ Download function using fetch API
✅ Loading and error states
✅ Tailwind CSS styling
✅ Conditional visibility (100% only)
```

### 3. No Dependencies to Install
- Uses built-in Fetch API
- Uses built-in Tailwind CSS
- No new npm packages needed

---

## 🧪 Quick Test (2 minutes)

### Step 1: Go to Progress Dashboard
```
1. Login as student
2. Go to any course
3. Click "View Progress" or navigate to progress page
4. URL: http://localhost:5173/course/{courseId}/progress
```

### Step 2: Check Course Status
```
If 100% complete:
  ✅ Green certificate card visible
  ✅ "Download Certificate" button visible
  ✅ Button is clickable

If < 100% complete:
  ✅ Gray certificate card visible
  ✅ Yellow warning message visible
  ✅ Shows remaining lectures needed
```

### Step 3: Test Download
```
1. Complete 100% of course
2. Click "Download Certificate" button
3. PDF should download as "certificate.pdf"
4. Verify PDF opens correctly
```

### Step 4: Test Error States
```
If button is clicked when course not 100%:
  ❌ Should show error (code prevents this)

If API fails:
  ❌ Red error box appears with message
  ❌ Can retry clicking button
```

---

## 🚀 How to Run

### Backend Already Running?
```bash
# If STEP-15A backend is running:
npm run dev    # In backend/ directory
# Should see: Server running on port 5000
```

### Frontend Ready?
```bash
# If frontend is running:
npm run dev    # In frontend/ directory
# Should see: Local:   http://localhost:5173
```

---

## 📋 What Was Changed

### File Modified
```
frontend/src/pages/ProgressDashboard.jsx
```

### Sections Added

#### 1. New State Variables (Lines ~25-28)
```javascript
const [certificateLoading, setCertificateLoading] = useState(false);
const [certificateError, setCertificateError] = useState(null);
```

#### 2. Download Function (Lines ~79-150)
```javascript
const handleGenerateCertificate = async () => {
  // Fetch API call to backend
  // Blob handling and download
}
```

#### 3. UI Section (Lines ~425-500)
```javascript
{progress.completionPercent === 100 ? (
  // Green card with download button
) : (
  // Gray card with incomplete message
)}
```

---

## ✨ Key Features

### Button Logic
```
IF completion = 100%
  THEN show green "Download Certificate" button
ELSE show yellow "Complete the course..." message
```

### Download Flow
```
Click Button
  ↓
Set Loading = true
  ↓
Get Token from localStorage
  ↓
Call API: GET /api/certificate/course/:courseId
  ↓
Convert Response to Blob (PDF)
  ↓
Create Download Link
  ↓
Trigger Download
  ↓
Clean Up
  ↓
Set Loading = false
```

### Error Handling
```
If error occurs:
  ✅ Error message displayed in red box
  ✅ User can see what went wrong
  ✅ User can retry clicking button
  ✅ Button becomes enabled again
```

---

## 🎨 UI Details

### Certificate Complete (Green Card)
```
🎓 Certificate of Completion

Congratulations! You've completed all course
requirements. Download your certificate to
showcase your achievement.

[📥 Download Certificate] ← Green button
```

### Certificate Incomplete (Gray Card)
```
🎓 Certificate of Completion

⚠️ Complete the course to unlock certificate

You're 15% away from earning your certificate.
Watch the remaining 2 lecture(s) to complete
the course.

[Progress bar: 85/100]
```

### Loading State
```
[⏳ Generating certificate...]
← Button disabled, spinner shows
```

### Error State
```
Certificate Error
Failed to generate certificate. Please try again.
← Red error box
```

---

## 🔍 Code Locations

### State Variables
**File:** `ProgressDashboard.jsx`  
**Lines:** ~25-28  
```javascript
const [certificateLoading, setCertificateLoading] = useState(false);
const [certificateError, setCertificateError] = useState(null);
```

### Download Function
**File:** `ProgressDashboard.jsx`  
**Lines:** ~79-150  
```javascript
const handleGenerateCertificate = async () => {
  // All download logic here
}
```

### UI - 100% Complete
**File:** `ProgressDashboard.jsx`  
**Lines:** ~425-470  
```javascript
{progress.completionPercent === 100 ? (
  // Green certificate card with button
)}
```

### UI - < 100% Complete
**File:** `ProgressDashboard.jsx`  
**Lines:** ~471-500  
```javascript
{progress.completionPercent === 100 ? (...) : (
  // Gray certificate card with message
)}
```

---

## ✅ Verification Checklist

- [ ] File `ProgressDashboard.jsx` exists
- [ ] File has ~120 new lines
- [ ] Certificate download function exists
- [ ] Two state variables added
- [ ] Certificate UI section added
- [ ] Green button for 100% complete
- [ ] Yellow message for < 100%
- [ ] All code has comments

---

## 🚨 Common Issues

### Issue: Button Not Visible
**Check:**
1. Is course 100% complete?
2. Refresh page to reload data
3. Check browser console (F12)

### Issue: PDF Won't Download
**Check:**
1. Backend running on port 5000?
2. Token valid? (Try logout/login)
3. Browser console for errors
4. Postman test the API directly

### Issue: Error Message Shows
**Check:**
1. What does error message say?
2. Is course really 100% complete?
3. Is backend running?
4. Check server logs

---

## 📊 Statistics

| Item | Value |
|------|-------|
| **Files Modified** | 1 |
| **Lines Added** | ~120 |
| **Functions Added** | 1 |
| **State Variables** | 2 |
| **Time to Verify** | 5 min |
| **Complexity** | Beginner-Friendly |

---

## 🎓 Next Steps

1. ✅ Verify file was updated
2. ✅ Test download button
3. ✅ Try all scenarios
4. ✅ Check error handling
5. ✅ Celebrate! 🎉

---

**Status:** ✅ Frontend Complete  
**Next:** Testing and deployment
