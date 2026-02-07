# Environment Variable Migration - API URL Update

## Changes Made

All frontend files have been updated to use `import.meta.env.VITE_API_URL` instead of hardcoded `http://localhost:5000/api`.

## Files Updated

### Utility Files
- ✅ `frontend/src/utils/api.js` - Main API utility

### Authentication Pages
- ✅ `frontend/src/pages/Login.jsx`
- ✅ `frontend/src/pages/Register.jsx`

### Course Pages
- ✅ `frontend/src/pages/CreateCourse.jsx`
- ✅ `frontend/src/pages/CourseDetail.jsx`

### Lecture Pages
- ✅ `frontend/src/pages/AddLecture.jsx`

### Quiz Pages
- ✅ `frontend/src/pages/CreateQuiz.jsx`
- ✅ `frontend/src/pages/AddQuestion.jsx`
- ✅ `frontend/src/pages/Quiz.jsx`
- ✅ `frontend/src/pages/QuizResults.jsx`

### Assignment Pages
- ✅ `frontend/src/pages/Assignment.jsx`
- ✅ `frontend/src/pages/AssignmentResult.jsx`
- ✅ `frontend/src/pages/AssignmentSubmissions.jsx`
- ✅ `frontend/src/pages/GradeSubmission.jsx`
- ✅ `frontend/src/pages/TeacherAssignments.jsx`

### Progress & Certificate
- ✅ `frontend/src/pages/ProgressDashboard.jsx`

### Admin Pages
- ✅ `frontend/src/pages/AdminDashboard.jsx`
- ✅ `frontend/src/pages/AdminUsers.jsx`
- ✅ `frontend/src/pages/AdminTeachers.jsx`

### Teacher Pages
- ✅ `frontend/src/pages/TeacherQuizzes.jsx`
- ✅ `frontend/src/pages/TeacherStudents.jsx`
- ✅ `frontend/src/pages/TeacherSubmissions.jsx`

## Pattern Used

### Before
```javascript
const response = await fetch('http://localhost:5000/api/endpoint', {
  // ...
});
```

### After
```javascript
const response = await fetch(`${import.meta.env.VITE_API_URL}/endpoint`, {
  // ...
});
```

## Environment Variable

**Variable Name:** `VITE_API_URL`

**Location:** `frontend/.env.local`

**Example Value:** `http://localhost:5000/api` or `https://api.example.com/api`

## Benefits

1. **Dynamic Configuration** - Change API URL without modifying code
2. **Environment-Specific** - Different URLs for dev, staging, production
3. **Vite Standard** - Uses Vite's built-in environment variable system
4. **Security** - Sensitive values can be excluded from version control
5. **Easy Deployment** - Update .env file during deployment

## Verification

All fetch calls now use:
- Template literals with backticks
- `import.meta.env.VITE_API_URL` instead of hardcoded URLs
- No hardcoded `http://localhost:5000` references remain in frontend code

## Usage in Production

Set the environment variable before building:

```bash
# Development
VITE_API_URL=http://localhost:5000/api npm run dev

# Production
VITE_API_URL=https://api.yourdomain.com/api npm run build
```

Or in `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```
