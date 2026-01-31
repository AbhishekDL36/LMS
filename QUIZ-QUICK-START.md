# Create Quiz Feature - Quick Start Guide

## 🚀 30-Second Overview

Teachers can now create quizzes for their courses:

1. Click "Create Quiz" button on any course
2. Enter quiz title
3. Click "Create Quiz"
4. Redirected to add questions page

---

## 📋 Files Modified

### Created
- `frontend/src/pages/CreateQuiz.jsx` (150 lines)

### Modified
- `frontend/src/router/router.jsx` (+5 lines)
- `frontend/src/pages/TeacherCourses.jsx` (+6 lines)

### Backend (Already Exists)
- `backend/routes/test.js` (POST /api/test/create)

---

## 🔗 Route Details

**Route Path:** `/app/teacher/course/:courseId/create-quiz`

**Button Location:** TeacherCourses page (orange button)

**Redirect:** `/app/teacher/course/{courseId}/quiz/{testId}/add-question`

---

## 📝 Form Details

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Title | Text | Yes | Quiz name |

That's it! Simple and focused.

---

## 🔐 Security

- ✅ Only teachers can access (roleMiddleware)
- ✅ Token required (authMiddleware)
- ✅ CourseId required
- ✅ Frontend + Backend validation

---

## 🧪 How to Test

1. Login as teacher
2. Click "My Courses"
3. Click "Create Quiz" on any course
4. Enter title: "Test Quiz"
5. Click "Create Quiz"
6. ✅ Should succeed and redirect

---

## 📊 Data Structure

### Request
```json
{
  "courseId": "609c1234567890abcdef1234",
  "title": "React Fundamentals Quiz"
}
```

### Response
```json
{
  "message": "Test created successfully",
  "testId": "609c5678901234567890abcd"
}
```

---

## 🎨 UI Colors

- **Button:** Orange (#ea580c)
- **Hover:** Darker Orange (#d68910)
- **Success:** Green
- **Error:** Red

---

## ✨ Key Code Snippets

### Get CourseId from URL
```javascript
const { courseId } = useParams();
```

### Get Token from Redux
```javascript
const token = useSelector((state) => state.auth.token);
```

### Check Teacher Role
```javascript
const userRole = localStorage.getItem('userRole');
if (userRole !== 'teacher') return <AccessDenied />;
```

### API Call
```javascript
const response = await fetch('http://localhost:5000/api/test/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ courseId, title }),
});
```

### Redirect with TestId
```javascript
const testId = data.testId;
navigate(`/app/teacher/course/${courseId}/quiz/${testId}/add-question`);
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Button not showing | Check TeacherCourses.jsx updated correctly |
| Form not submitting | Check token exists in Redux state |
| 403 Forbidden | Verify role is 'teacher' in localStorage |
| Page not found | Verify router.jsx has correct route |

---

## 📱 UI Preview

```
┌─────────────────────────┐
│  My Courses             │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ React Course        │ │
│ │ [View][Lecture][Quiz] │
│ │ [Edit] [Delete]     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Quiz Title Form     │ │
│ │ Enter title... ___  │ │
│ │ [Create] [Cancel]   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

---

## ✅ Success Indicators

After implementation, you should see:
- [x] Orange "Create Quiz" button on course cards
- [x] Form loads when clicking button
- [x] Quiz saves to database
- [x] Redirect to add questions page
- [x] testId appears in URL

---

## 🔄 Related Features

**Before This:**
- Create Course ✅
- Add Lectures ✅

**After This:**
- Add Questions to Quiz (Next)
- Student Takes Quiz (Next)
- View Quiz Results (Next)

---

## 📞 Need Help?

- **Implementation Details:** See `CREATE-QUIZ-FEATURE-GUIDE.md`
- **Verification:** See `CREATE-QUIZ-VERIFICATION.md`
- **Full Summary:** See `QUIZ-FEATURE-IMPLEMENTATION-SUMMARY.md`
- **Code Comments:** Check CreateQuiz.jsx for inline documentation

---

## 🎯 Success Checklist

- [ ] Route /app/teacher/course/:courseId/create-quiz works
- [ ] Teacher can access form
- [ ] Student sees access denied
- [ ] Form validates title required
- [ ] API call succeeds
- [ ] Quiz saves in MongoDB
- [ ] Redirect happens with testId
- [ ] Orange button shows on courses

---

**Ready to test!** 🚀

Start with step 1: Login as teacher → Click "My Courses" → Click "Create Quiz"
