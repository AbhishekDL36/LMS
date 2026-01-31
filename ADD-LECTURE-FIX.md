# Add Lecture Button Fix

## Problem
"Add Lecture" button on teacher's My Courses page was not working - clicking it had no effect.

## Root Cause
AddLecture.jsx read role from non-existent localStorage key 'userRole':
```javascript
const userRole = localStorage.getItem('userRole');  // WRONG - key doesn't exist
```

Since userRole was undefined, the role check failed and page showed "Access Denied" error.

## Solution

### 1. Fixed AddLecture.jsx
Changed to read role from Redux:
```javascript
const userRole = useSelector((state) => state.auth.role);  // CORRECT
```

### 2. Updated TeacherCourses.jsx
Changed to use apiGet utility instead of manual token handling:
```javascript
// Before
const token = getToken();
const response = await fetch('http://localhost:5000/api/course/teacher', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// After
const response = await apiGet('/course/teacher');
```

## Test Steps

1. Login as teacher
2. Click "My Courses" in navbar
3. Click "Add Lecture" button on a course card
4. Should navigate to Add Lecture form
5. Fill in:
   - Lecture Title: "Introduction to Topic"
   - Video URL: "https://example.com/video.mp4"
6. Click "Add Lecture"
7. Should see success message
8. Should be redirected back to My Courses

## Files Fixed
- frontend/src/pages/AddLecture.jsx
- frontend/src/pages/TeacherCourses.jsx
