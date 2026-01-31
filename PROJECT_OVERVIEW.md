# 🎓 LMS Full-Stack Project - Complete Reference Guide

**Status:** ✅ Advanced Stage (Step 21+)  
**Tech Stack:** React 19 + Node.js/Express + MongoDB  
**Architecture:** Full-Stack with Role-Based Access Control  
**Last Updated:** January 30, 2026

---

## 📋 Project Summary

This is a **complete Learning Management System** supporting three user roles:
- **Students** - Take courses, watch videos, complete assignments, take quizzes
- **Teachers** - Create courses, add lectures, create quizzes, grade submissions
- **Admins** - Manage platform, view all users and courses, oversee operations

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React 19)                      │
│  ┌─────────────┬──────────────┬──────────────┬────────────┐ │
│  │  Student    │   Teacher    │    Admin     │  Auth      │ │
│  │  Dashboard  │  Dashboard   │  Dashboard   │  System    │ │
│  └─────────────┴──────────────┴──────────────┴────────────┘ │
│  ├── Pages: 30+ components                                  │
│  ├── Routing: Role-based navigation (RoleLayout)            │
│  ├── State: Redux (app store)                               │
│  └── Styling: Tailwind CSS + Custom CSS                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/JSON
┌──────────────────────────▼──────────────────────────────────┐
│                  BACKEND (Node.js/Express)                  │
│  ┌────────────┬──────────────┬────────────┬──────────────┐ │
│  │  Auth      │  Courses     │  Quiz      │  Admin       │ │
│  │  Routes    │  Routes      │  Routes    │  Routes      │ │
│  └────────────┴──────────────┴────────────┴──────────────┘ │
│  ├── 13 API route files                                     │
│  ├── Middleware: Auth, CORS, Roles                          │
│  └── Database: MongoDB (Mongoose models)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │ MongoDB Driver
┌──────────────────────────▼──────────────────────────────────┐
│              DATABASE (MongoDB + Mongoose)                  │
│  ├── Users (students, teachers, admins)                    │
│  ├── Courses (created by teachers)                         │
│  ├── Lectures (within courses)                             │
│  ├── Enrollments (student + course linking)                │
│  ├── Assignments (teacher-created tasks)                   │
│  ├── Submissions (student work + grades)                   │
│  ├── Quizzes (teacher-created assessments)                 │
│  ├── QuizAnswers (student responses)                       │
│  ├── Progress (course completion tracking)                 │
│  ├── Certificates (completion proof)                       │
│  └── Metadata (watch times, grades, etc.)                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 📂 Directory Structure

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── app/                    # Redux store configuration
│   │   └── store.js
│   ├── components/             # Shared components
│   │   ├── StudentNavbar.jsx    # Student navigation
│   │   ├── TeacherNavbar.jsx    # Teacher navigation
│   │   ├── AdminNavbar.jsx      # Admin navigation
│   │   └── ProtectedRoute.jsx   # Route protection wrapper
│   ├── features/               # Redux slices (state management)
│   ├── layouts/
│   │   └── RoleLayout.jsx       # Role-based layout router
│   ├── pages/                  # Page components (30+ files)
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── CourseDetail.jsx
│   │   ├── CreateCourse.jsx
│   │   ├── AddLecture.jsx
│   │   ├── CreateQuiz.jsx
│   │   ├── AddQuestion.jsx
│   │   ├── Quiz.jsx
│   │   ├── Assignment.jsx
│   │   ├── GradeSubmission.jsx
│   │   └── ... (15+ more pages)
│   ├── router/
│   │   └── router.jsx           # Main routing configuration
│   ├── utils/                   # Utility functions
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── package.json
├── vite.config.js
└── [Documentation files]
```

### Backend (`/backend`)
```
backend/
├── config/
│   └── db.js                   # MongoDB connection
├── middleware/
│   ├── auth.js                 # JWT verification
│   └── roles.js                # Role-based authorization
├── models/                     # Mongoose schemas (12 models)
│   ├── User.js
│   ├── Course.js
│   ├── Lecture.js
│   ├── Enrollment.js
│   ├── Assignment.js
│   ├── Submission.js
│   ├── Quiz.js
│   ├── Question.js
│   ├── QuizAnswer.js
│   ├── Progress.js
│   ├── Certificate.js
│   └── WatchTime.js
├── routes/                     # API endpoints (13 route files)
│   ├── auth.js
│   ├── course.js
│   ├── lecture.js
│   ├── enrollment.js
│   ├── assignment.js
│   ├── progress.js
│   ├── quiz.js (via test.js)
│   ├── dashboard.js
│   ├── admin.js
│   ├── certificate.js
│   ├── watchTime.js
│   ├── roles.js
│   └── protected.js
├── server.js                   # Express app setup
├── package.json
├── .env                        # Environment variables
└── [Documentation files]
```

---

## 🔐 Authentication & Authorization

### User Roles
```javascript
// Three roles in the system:
const roles = ['student', 'teacher', 'admin'];

// Role permissions:
// STUDENT:
//   - View enrolled courses
//   - Watch lectures
//   - Take quizzes
//   - Submit assignments
//   - View own progress/certificates

// TEACHER:
//   - Create courses
//   - Add lectures to courses
//   - Create quizzes
//   - Create assignments
//   - Grade submissions
//   - View enrolled students
//   - Access teacher dashboard

// ADMIN:
//   - View all users (students, teachers)
//   - View all courses
//   - View platform statistics
//   - Manage user accounts
//   - Access admin dashboard
```

### Authentication Flow
```
User Registration → Select Role → Save to Database
                        ↓
                   Login with Email/Password
                        ↓
                   Verify Credentials (bcrypt)
                        ↓
                   Generate JWT Token
                        ↓
                   Send Token to Frontend
                        ↓
                   Store in LocalStorage
                        ↓
                   Attach to API Requests (Authorization header)
                        ↓
                   Backend Verifies Token
                        ↓
                   Role Middleware Checks Access
                        ↓
                   Proceed or Return 403 (Forbidden)
```

---

## 🛣️ Frontend Navigation Structure

### Routes by Role

**STUDENT ROUTES:**
```
/                          → Login page (if not authenticated)
/register                  → Registration page
/app                       → RoleLayout (determines role)
└── /app/student
    ├── /dashboard         → StudentDashboard (courses, assignments, quizzes)
    ├── /course/:id        → CourseDetail (video player, lectures)
    ├── /assignment/:id    → Assignment (submit work)
    ├── /quiz/:id          → Quiz (take quiz)
    ├── /results/:id       → QuizResults (see quiz grades)
    ├── /progress          → ProgressDashboard (completion tracking)
    └── /certificates      → Certificate list
```

**TEACHER ROUTES:**
```
/app/teacher
├── /dashboard             → TeacherDashboard (stats, quick actions)
├── /courses               → TeacherCourses (list teacher's courses)
├── /course/create         → CreateCourse (form)
├── /course/:id            → CourseDetail (edit/view)
├── /lecture/add/:courseId → AddLecture (upload video)
├── /quiz/create/:courseId → CreateQuiz
├── /quiz/:id/question/add → AddQuestion (to quiz)
├── /assignments           → TeacherAssignments (view all)
├── /submissions           → TeacherSubmissions (grade work)
├── /grade/:submissionId   → GradeSubmission (submit grade)
├── /students              → TeacherStudents (enrolled in courses)
└── /quizzes               → TeacherQuizzes (list quizzes)
```

**ADMIN ROUTES:**
```
/app/admin
├── /dashboard             → AdminDashboard (platform statistics)
├── /users                 → AdminUsers (all users)
├── /teachers              → AdminTeachers (all teachers)
└── /courses               → AdminCourses (all courses)
```

---

## 🔌 Key Frontend Components

### App.jsx
- Root component
- Initializes routing
- Manages Redux store provider

### RoleLayout.jsx
- Determines user role from Redux store
- Routes to correct dashboard (Student/Teacher/Admin)
- Wraps protected components
- Falls back to login if no authentication

### StudentNavbar.jsx
- Navigation for student role
- Menu items: Dashboard, Courses, Assignments, Quizzes, Progress
- Logout button

### TeacherNavbar.jsx
- Navigation for teacher role
- Menu items: Dashboard, My Courses, Create Course, Assignments, Students
- Logout button

### AdminNavbar.jsx
- Navigation for admin role
- Menu items: Dashboard, Users, Teachers, Courses
- Logout button

### ProtectedRoute.jsx
- Wrapper component for protected pages
- Checks token existence
- Redirects to login if no token

---

## 🌐 Backend API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /register              - Register new user with role
POST   /login                 - Login user, return JWT token
POST   /logout                - Logout user
GET    /profile               - Get current user profile
```

### Course Routes (`/api/course`)
```
POST   /                      - Create course (teacher)
GET    /enrolled              - Get enrolled courses (student)
GET    /:courseId             - Get course details
PUT    /:courseId             - Update course (teacher)
DELETE /:courseId             - Delete course (teacher)
GET    /teacher/:teacherId    - Get teacher's courses
```

### Lecture Routes (`/api/lecture`)
```
POST   /                      - Add lecture (teacher)
GET    /:lectureId            - Get lecture details
PUT    /:lectureId            - Update lecture
DELETE /:lectureId            - Delete lecture
GET    /course/:courseId      - Get all lectures in course
```

### Enrollment Routes (`/api/enrollment`)
```
POST   /                      - Enroll student in course
GET    /course/:courseId      - Get all enrollments for course
GET    /student/:studentId    - Get student's enrollments
DELETE /:enrollmentId         - Unenroll student
```

### Quiz Routes (`/api/test`)
```
POST   /                      - Create quiz (teacher)
GET    /:quizId               - Get quiz details
POST   /submit                - Submit quiz answers (student)
GET    /results/:studentId    - Get student's quiz results
PUT    /:quizId               - Update quiz
DELETE /:quizId               - Delete quiz
```

### Assignment Routes (`/api/assignment`)
```
POST   /                      - Create assignment (teacher)
GET    /course/:courseId      - Get assignments for course
GET    /:assignmentId         - Get assignment details
POST   /submit                - Submit assignment (student)
GET    /submissions/:id       - Get assignment submissions
```

### Submission Routes (via `/api/assignment`)
```
GET    /submission/:id        - Get specific submission
PUT    /submission/:id/grade  - Grade submission (teacher)
GET    /submissions           - Get all submissions (teacher)
```

### Progress Routes (`/api/progress`)
```
POST   /complete              - Mark lecture complete
GET    /:courseId             - Get progress for course
GET    /student/:studentId    - Get student's progress
```

### Certificate Routes (`/api/certificate`)
```
POST   /generate              - Generate certificate (auto)
GET    /student/:studentId    - Get student's certificates
GET    /:certificateId        - Get certificate details
```

### Dashboard Routes (`/api/dashboard`)
```
GET    /student               - Get student dashboard data
GET    /teacher               - Get teacher dashboard data
```

### Admin Routes (`/api/admin`)
```
GET    /stats                 - Platform statistics
GET    /users                 - All users
GET    /teachers              - All teachers
GET    /courses               - All courses
```

---

## 💾 Database Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  role: Enum(['student', 'teacher', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Course Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  teacherId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Lecture Model
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: Course),
  title: String,
  videoUrl: String,
  duration: Number (seconds),
  sequenceNumber: Number,
  createdAt: Date
}
```

### Enrollment Model
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: Course),
  studentId: ObjectId (ref: User),
  enrolledAt: Date,
  status: Enum(['active', 'completed', 'dropped'])
}
```

### Quiz Model
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: Course),
  title: String,
  totalMarks: Number,
  passingMarks: Number,
  createdAt: Date
}
```

### Question Model
```javascript
{
  _id: ObjectId,
  quizId: ObjectId (ref: Quiz),
  questionText: String,
  options: [String],
  correctAnswer: String,
  marks: Number
}
```

### QuizAnswer Model
```javascript
{
  _id: ObjectId,
  quizId: ObjectId (ref: Quiz),
  studentId: ObjectId (ref: User),
  answers: [String],
  obtainedMarks: Number,
  submittedAt: Date
}
```

### Assignment Model
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: Course),
  title: String,
  description: String,
  dueDate: Date,
  totalMarks: Number,
  createdAt: Date
}
```

### Submission Model
```javascript
{
  _id: ObjectId,
  assignmentId: ObjectId (ref: Assignment),
  studentId: ObjectId (ref: User),
  submissionText: String,
  submittedAt: Date,
  grade: Number,
  feedback: String,
  gradedAt: Date
}
```

### Progress Model
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  completedLectures: [ObjectId],
  percentage: Number,
  completedAt: Date
}
```

### Certificate Model
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  issuedAt: Date,
  certificateUrl: String
}
```

---

## 🔑 Key Technologies & Dependencies

### Frontend
- **React 19.2.0** - UI library
- **React Router 7.12.0** - Navigation
- **Redux (with @reduxjs/toolkit)** - State management
- **Axios** - HTTP client (optional, can use fetch)
- **Tailwind CSS 4.1.18** - Styling
- **Vite 7.2.4** - Build tool

### Backend
- **Node.js** - Runtime
- **Express 4.22.1** - Web framework
- **MongoDB** - Database
- **Mongoose 7.8.8** - ODM for MongoDB
- **bcryptjs 2.4.3** - Password hashing
- **jsonwebtoken 9.0.3** - JWT authentication
- **cors 2.8.5** - Cross-Origin Resource Sharing
- **dotenv 16.6.1** - Environment variables
- **pdfkit 0.13.0** - Certificate PDF generation

---

## 📊 Redux Store Structure (Frontend)

```javascript
store = {
  auth: {
    user: {
      _id: String,
      name: String,
      email: String,
      role: String ('student'|'teacher'|'admin')
    },
    token: String,
    isLoading: Boolean,
    error: String | null
  },
  dashboard: {
    stats: {},
    courses: [],
    isLoading: Boolean
  },
  courses: {
    list: [],
    currentCourse: {},
    isLoading: Boolean
  },
  // ... more slices as needed
}
```

---

## 🎯 Current Implementation Status

### ✅ COMPLETED Features

#### Step 1-8: Backend Foundation
- [x] Database setup (MongoDB + Mongoose)
- [x] User models and authentication
- [x] Bcrypt password hashing
- [x] JWT token generation
- [x] All 13 API routes
- [x] Middleware (auth, roles)
- [x] CORS configuration

#### Step 9-10: Frontend & Basic Features
- [x] React app setup
- [x] Login/Registration pages
- [x] Routing system
- [x] API integration
- [x] Student dashboard
- [x] Course viewing

#### Step 10B-12: Course Content & Assignments
- [x] Lecture creation
- [x] Video player
- [x] Assignment submission
- [x] Watch time tracking

#### Step 13: Grading System
- [x] Quiz creation
- [x] Question management
- [x] Quiz submission
- [x] Answer grading
- [x] Results display

#### Step 14-15: Progress & Certificates
- [x] Progress tracking
- [x] Completion percentage
- [x] Certificate generation
- [x] Certificate display

#### Step 16-20: Role-Based Features
- [x] Teacher dashboard
- [x] Teacher course management
- [x] Teacher student view
- [x] Teacher submissions view
- [x] Teacher quiz view
- [x] Admin role creation
- [x] Admin dashboard
- [x] Admin user management
- [x] Admin teacher management
- [x] Admin course management
- [x] Role-based navigation
- [x] Role-based routing

#### Step 21: Teacher Dashboard Functionality
- [x] Clickable dashboard cards
- [x] Navigation to course list
- [x] Navigation to student list
- [x] Navigation to submission list
- [x] Navigation to quiz list
- [x] Student enrollment count fix
- [x] Duplicate logout button removal

### ⚠️ IN PROGRESS / TODO Features

1. **Drag & Drop Interface** - Reorder lectures/questions
2. **Video Resume** - Resume watching from where left off
3. **Analytics** - Advanced statistics and charts
4. **Notifications** - Email/in-app notifications
5. **Discussion Forum** - Course-based discussions
6. **Code Editor** - For programming assignments
7. **Plagiarism Detection** - Check assignment originality
8. **Dark Mode** - Theme switching
9. **Mobile App** - React Native version
10. **Caching & Optimization** - Performance improvements

---

## 🚀 Running the Project

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGO_URI=your_mongodb_connection
# JWT_SECRET=your_secret_key
# PORT=5000
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Testing
- Use Postman for API testing (examples in docs)
- Use browser DevTools for frontend debugging
- Use Redux DevTools for state debugging

---

## 📝 Important Files to Know

### Frontend (Most Important)
- `frontend/src/router/router.jsx` - All routes defined
- `frontend/src/layouts/RoleLayout.jsx` - Role determination & layout
- `frontend/src/App.jsx` - Root component
- `frontend/src/app/store.js` - Redux store
- `frontend/src/pages/` - All page components

### Backend (Most Important)
- `backend/server.js` - Express app setup
- `backend/middleware/auth.js` - JWT verification
- `backend/middleware/roles.js` - Role-based access
- `backend/routes/` - All API endpoints
- `backend/models/` - Database schemas

---

## 🎓 How to Extend the Project

### Add a New Feature (e.g., Discussion Forum)

**Backend:**
1. Create model: `backend/models/Discussion.js`
2. Create routes: `backend/routes/discussion.js`
3. Register in `backend/server.js`
4. Add middleware if role-specific

**Frontend:**
1. Create page: `frontend/src/pages/Discussion.jsx`
2. Add Redux slice if needed
3. Add routes in `frontend/src/router/router.jsx`
4. Add navbar item

---

## 🐛 Common Issues & Solutions

### Issue: 401 Unauthorized
- **Cause:** Missing or invalid token
- **Solution:** Check localStorage has token, verify JWT validity

### Issue: 403 Forbidden
- **Cause:** User role doesn't have permission
- **Solution:** Check role middleware in backend, verify user role

### Issue: CORS Error
- **Cause:** Frontend URL not allowed in backend
- **Solution:** Check CORS configuration in `backend/server.js`

### Issue: Blank Dashboard
- **Cause:** API endpoint returning error
- **Solution:** Check browser console, test API with Postman

---

## 📞 Quick Reference

### Token Location
- Frontend: `localStorage.getItem('token')`
- Sent as: `Authorization: Bearer <token>`

### Backend Middleware Stack
1. CORS check
2. JSON parsing
3. JWT verification (if protected route)
4. Role check (if role-specific)
5. Request handler

### Frontend State Management
- Redux for global auth state
- Local state for component-specific data
- API calls via axios/fetch

---

## 🎯 Next Priority Items

Based on the project thread, the recommended next steps are:

1. **Enhance Teacher Dashboard** - Add more filters, exports
2. **Add Search/Filter** - Find courses, students, submissions
3. **Implement Notifications** - Email on new assignments
4. **Add Pagination** - Large data sets
5. **Performance Optimization** - Lazy loading, caching

---

## 📚 Documentation Files in Project

**Frontend Docs:**
- `frontend/START_HERE_FIRST.md` - Quick start
- `frontend/CODE_OVERVIEW.md` - Component explanations
- `frontend/ARCHITECTURE.md` - System design
- `frontend/TESTING_GUIDE.md` - Testing procedures

**Backend Docs:**
- `backend/QUIZ-API-REFERENCE.md` - Quiz API details
- Various STEP-*.md files explaining each phase

**Root Docs:**
- `INDEX.md` - Navigation guide
- `FINAL_SUMMARY.md` - Project summary

---

## 🔒 Security Notes

### Current Implementation
- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ CORS protection

### Recommendations for Production
- Use httpOnly cookies instead of localStorage
- Implement refresh token rotation
- Add rate limiting
- Validate all inputs server-side
- Use HTTPS
- Add helmet for security headers
- Implement CSRF protection

---

## 📈 Performance Optimization Tips

1. **Frontend:**
   - Use React.memo for expensive components
   - Implement lazy loading with React.lazy()
   - Use useCallback for function memoization
   - Implement pagination for large lists

2. **Backend:**
   - Add indexes to frequently queried fields
   - Implement caching with Redis
   - Use pagination in list endpoints
   - Optimize aggregation pipelines

3. **Database:**
   - Create compound indexes
   - Archive old data
   - Monitor query performance

---

## 🎉 Summary

You have a **complete, functional Learning Management System** with:
- ✅ Full authentication & authorization
- ✅ Three distinct user roles
- ✅ Course management
- ✅ Quiz system
- ✅ Assignment submission
- ✅ Progress tracking
- ✅ Certificate generation
- ✅ Professional admin dashboard
- ✅ 40+ API endpoints
- ✅ 30+ React components
- ✅ Comprehensive documentation

**Everything is ready for further development or deployment.**

---

**Ready to build the next feature?** Let me know what you need! 🚀
