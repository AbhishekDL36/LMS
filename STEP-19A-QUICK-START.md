# STEP-19A: Add Questions to Quiz - Quick Start

## Status: ✅ COMPLETE & READY TO TEST

---

## 🚀 Quick Setup (2 minutes)

### 1. Ensure Backend is Running
```bash
cd backend
npm start
# Should see: "Server running on port 5000"
```

### 2. Ensure Frontend is Running
```bash
cd frontend
npm run dev
# Should see: "http://localhost:5173"
```

### 3. Ensure MongoDB is Running
- MongoDB should be running and accessible
- Check backend console for connection message

---

## 🧪 Quick Test (5 minutes)

### Test: Add a Question to Quiz

**Step 1: Login as Teacher**
```
URL: http://localhost:5173
Email: teacher@example.com
Password: password123
(or use your test teacher account)
```

**Step 2: Create a Quiz**
```
1. Click "My Courses"
2. Click "Create Quiz" on any course
3. Enter title: "Test Quiz"
4. Click "Create Quiz"
5. Auto-redirected to /app/teacher/quiz/{testId}/add-question
```

**Step 3: Add a Question**
```
1. Question Text: "What is React?"
2. Option A: "A JavaScript library"
3. Option B: "A programming language"
4. Option C: "A database"
5. Option D: "A server framework"
6. Correct Answer: "A"
7. Click "Add Question"
```

**Step 4: Verify Success**
```
✅ See green success message
✅ Form clears for next question
✅ Can add more questions or click "Done"
```

---

## 🔍 What Gets Created in Database

### Test (Quiz) Document
```json
{
  "_id": "507f191e810c19729de860ea",
  "title": "Test Quiz",
  "courseId": "507f1f77bcf86cd799439011",
  "createdBy": "507f1f77bcf86cd799439012",
  "createdAt": "2026-01-29T..."
}
```

### Question Document
```json
{
  "_id": "607f1f77bcf86cd799439013",
  "testId": "507f191e810c19729de860ea",
  "questionText": "What is React?",
  "options": [
    "A JavaScript library",
    "A programming language",
    "A database",
    "A server framework"
  ],
  "correctAnswer": "A",
  "createdAt": "2026-01-29T..."
}
```

---

## 📋 API Endpoint Reference

### Create Question
```
POST /api/test/question
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "testId": "507f191e810c19729de860ea",
  "questionText": "What is React?",
  "options": [
    "A JavaScript library",
    "A programming language",
    "A database",
    "A server framework"
  ],
  "correctAnswer": "A"
}

Response (201):
{
  "message": "Question added successfully",
  "questionId": "607f1f77bcf86cd799439013"
}
```

### Error Responses
```
400: "Question text is required"
400: "Options are required"
400: "Correct answer must be one of the options"
401: "Unauthorized" (invalid token)
403: "Forbidden" (not a teacher)
404: "Test not found" (invalid testId)
```

---

## 🧠 Code Location Reference

| Task | File | Line |
|------|------|------|
| Add Question endpoint | backend/routes/test.js | 68-128 |
| Form UI | frontend/src/pages/AddQuestion.jsx | 169-315 |
| Form submission | frontend/src/pages/AddQuestion.jsx | 61-167 |
| Route definition | frontend/src/router/router.jsx | 123-127 |
| Quiz creation (redirects here) | frontend/src/pages/CreateQuiz.jsx | 110 |
| Quiz button on courses | frontend/src/pages/TeacherCourses.jsx | 134-139 |

---

## ✅ Verification Checklist

After testing, verify:
- [ ] Teachers can create quiz
- [ ] Auto-redirects to add questions page
- [ ] Form accepts question details
- [ ] Form validates all fields required
- [ ] Success message appears
- [ ] Form clears for next question
- [ ] Database has Question document
- [ ] testId matches Quiz ID
- [ ] Options and correctAnswer are saved
- [ ] Students cannot access this page
- [ ] Page requires authentication

---

## 💡 Testing Tips

1. **Use Browser DevTools (F12)**
   - Network tab: See API requests/responses
   - Console tab: See error messages
   - Application tab: See localStorage/Redux state

2. **Test Multiple Questions**
   - Add 3-4 questions to same quiz
   - Verify each creates separate Question document

3. **Test Error Cases**
   - Try empty fields
   - Try invalid testId
   - Try clearing token (logout then try to add)

4. **Check Database**
   - Use MongoDB Compass or mongosh
   - View Test and Question collections
   - Verify data relationships

---

## 🎬 Video Test Walkthrough

### Expected Behavior

1. **Click "Create Quiz"** → Form appears
2. **Enter title** → No validation yet
3. **Click "Create Quiz"** → Loading state shows
4. **Quiz created** → Success message + redirect (1.5 sec)
5. **AddQuestion page loads** → Form ready
6. **Fill question details** → Form accepts input
7. **Click "Add Question"** → Loading state shows
8. **Question saved** → Success message + form clears
9. **Can add more** → Repeat from step 6

---

## 🔧 Configuration

### Backend URL
If backend is NOT on port 5000:
- Edit `frontend/src/pages/AddQuestion.jsx` line 126
- Change: `http://localhost:5000/api/test/question`

### Redux Token Path
If auth state structure is different:
- Edit `frontend/src/pages/AddQuestion.jsx` line 12
- Current: `state.auth.token`

### Route Path
If router structure is different:
- Edit `frontend/src/router/router.jsx` line 125
- Current: `/app/teacher/quiz/:testId/add-question`

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| 404 on quiz creation | Backend route not registered in server.js |
| "Cannot POST /question" | testRoutes not imported in server.js |
| "Quiz ID is missing" | Not accessing from CreateQuiz redirect |
| "Access Denied" | Logged in as student, not teacher |
| Form won't submit | Check validation errors in form |
| Question not saving | Check MongoDB connection |
| No success message | Check browser console for errors |

---

## 📊 Success Criteria

✅ Feature is working if:
1. Teachers can create quizzes
2. Teachers can add questions with 4 options
3. Correct answer is validated
4. Questions are saved with testId reference
5. Form clears after each question
6. Error messages appear for validation fails
7. Students cannot access the page
8. Database has Question documents

---

## 🎯 Next Steps

After verifying this feature works:
1. Create more test questions
2. Try the "Student Quiz Taking" feature (STEP-19B)
3. View quiz results
4. Verify grading works

---

## 📞 Quick Help

**Backend not running?**
```bash
cd backend && npm start
```

**Frontend not running?**
```bash
cd frontend && npm run dev
```

**MongoDB not running?**
```bash
# On Windows
mongod

# On Mac/Linux
mongodb-community-server
```

**Clear cache/cookies?**
```
Open DevTools (F12) → Application → Clear Site Data
```

**Reset database?**
```
Delete database or use MongoDB Compass to clear collections
```

---

**Status:** ✅ Ready to Test
**Time to Verify:** 5-10 minutes
**Difficulty:** Easy
**Prerequisites:** Backend + Frontend + MongoDB running
