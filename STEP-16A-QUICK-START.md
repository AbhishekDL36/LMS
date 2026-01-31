# STEP-16A: Quick Start - Dashboard Backend

## ⚡ 5-Minute Verification

### 1. Files Created/Updated ✅
```
✅ routes/dashboard.js (NEW - 260 lines)
✅ server.js (UPDATED - added route import and mount)
```

### 2. What's New
```
✅ Student dashboard endpoint
✅ Teacher dashboard endpoint
✅ Role-based access control
✅ Dashboard statistics calculations
```

### 3. No Dependencies to Install
- Uses existing models
- Uses existing middleware
- No npm packages needed

---

## 🧪 Quick Test (5 minutes)

### Step 1: Start Backend
```bash
cd backend
npm run dev
# Should see: Server running on port 5000
```

### Step 2: Test Student Dashboard

**In Postman:**
```
1. Login as student
   POST http://localhost:5000/api/auth/login
   Body: { "email": "student@example.com", "password": "..." }

2. Copy token from response

3. Get dashboard
   GET http://localhost:5000/api/dashboard/student
   Header: Authorization: Bearer {token}

4. Should see response with:
   - totalEnrolledCourses
   - completedCourses
   - averageQuizScore
   - pendingAssignments
```

### Step 3: Test Teacher Dashboard

**In Postman:**
```
1. Login as teacher
   POST http://localhost:5000/api/auth/login
   Body: { "email": "teacher@example.com", "password": "..." }

2. Copy token from response

3. Get dashboard
   GET http://localhost:5000/api/dashboard/teacher
   Header: Authorization: Bearer {token}

4. Should see response with:
   - totalCoursesCreated
   - totalStudentsEnrolled
   - pendingSubmissions
   - totalQuizzesCreated
```

---

## 📊 Expected Responses

### Student Dashboard (200 OK)
```json
{
  "message": "Student dashboard retrieved successfully",
  "studentId": "507f1f77bcf86cd799439011",
  "totalEnrolledCourses": 3,
  "completedCourses": 0,
  "averageQuizScore": 78,
  "pendingAssignments": 2
}
```

### Teacher Dashboard (200 OK)
```json
{
  "message": "Teacher dashboard retrieved successfully",
  "teacherId": "507f1f77bcf86cd799439012",
  "totalCoursesCreated": 2,
  "totalStudentsEnrolled": 45,
  "pendingSubmissions": 8,
  "totalQuizzesCreated": 5
}
```

---

## 🚀 Routes Available

### Student Dashboard
```
GET /api/dashboard/student
Authorization: Bearer {student-token}
```

### Teacher Dashboard
```
GET /api/dashboard/teacher
Authorization: Bearer {teacher-token}
```

---

## 🔍 Key Features

✅ **Student Dashboard Shows:**
- How many courses enrolled in
- How many completed
- Average quiz score
- Pending assignments to submit

✅ **Teacher Dashboard Shows:**
- How many courses created
- How many students total
- How many assignments pending grading
- How many quizzes created

---

## ❌ Error Cases to Try

### Test 1: No Token
```
GET http://localhost:5000/api/dashboard/student
(No Authorization header)

Response: 401 "Access denied. No token provided."
```

### Test 2: Wrong Role
```
GET http://localhost:5000/api/dashboard/student
Authorization: Bearer {teacher-token}

Response: 403 "Access denied. Only student can access this."
```

### Test 3: Bad Token
```
GET http://localhost:5000/api/dashboard/student
Authorization: Bearer invalid-token-here

Response: 401 "Invalid token"
```

---

## 📋 Code Locations

### Routes
**File:** `routes/dashboard.js`
- Lines ~14-80: Student dashboard route
- Lines ~83-190: Teacher dashboard route

### Server Configuration
**File:** `server.js`
- Line ~16: Import dashboard routes
- Line ~54: Mount dashboard routes

---

## 🎯 What Each Endpoint Does

### GET /api/dashboard/student
```
1. Check if user authenticated (authMiddleware)
2. Check if user is student (roleMiddleware)
3. Find all courses student enrolled in
4. Find all quizzes student attempted
5. Find all ungraded assignments
6. Return aggregated stats
```

### GET /api/dashboard/teacher
```
1. Check if user authenticated (authMiddleware)
2. Check if user is teacher (roleMiddleware)
3. Find all courses teacher created
4. Find all students in those courses
5. Find all ungraded assignments
6. Find all quizzes teacher created
7. Return aggregated stats
```

---

## ✅ Verification Checklist

- [ ] `routes/dashboard.js` exists and has code
- [ ] `server.js` imports dashboard routes
- [ ] `server.js` mounts routes at `/api/dashboard`
- [ ] Server starts without errors
- [ ] Student endpoint returns correct data
- [ ] Teacher endpoint returns correct data
- [ ] Error handling works (missing token, wrong role)

---

## 🚨 Common Issues

| Problem | Solution |
|---------|----------|
| 404 Route not found | Restart server after changes |
| 401 No token error | Add Authorization header |
| 403 Wrong role error | Use correct role token |
| Empty counts | Normal if no data in DB |
| Server won't start | Check syntax in dashboard.js |

---

## 📊 What's Calculated

**For Students:**
- Total courses = count from Enrollments
- Completed courses = 0 (placeholder)
- Average quiz = mean of TestResults scores
- Pending = ungraded AssignmentSubmissions

**For Teachers:**
- Courses created = count from Courses
- Students = unique count from Enrollments
- Pending = ungraded AssignmentSubmissions
- Quizzes = count from Tests

---

## 🎓 Next Steps

1. ✅ Verify backend is working
2. ✅ Test both endpoints
3. ✅ Try error cases
4. ✅ Review code structure
5. → **STEP-16B** will create frontend pages to display this data

---

**Status:** ✅ Backend Complete  
**Next:** STEP-16B Frontend Integration
