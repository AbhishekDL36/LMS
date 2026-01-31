# LMS Project - Complete Architecture & Structure

## Project Overview
Full-stack Learning Management System with role-based access (Student, Teacher, Admin). Built with Express.js backend and React frontend.

---

## BACKEND STRUCTURE

### Server Setup
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Port**: 5000
- **Entry File**: `backend/server.js`

### Database Models

#### 1. User
- Fields: name, email, password (hashed), role (student/teacher/admin), emailVerified, authProvider, googleId
- Roles: student, teacher, admin
- Authentication: JWT tokens

#### 2. Course
- Fields: title, description, teacherId (ref: User), createdAt, updatedAt
- Created by teachers only
- Students enroll in courses

#### 3. Lecture
- Fields: courseId (ref: Course), title, videoUrl, order
- Multiple lectures per course
- Ordered by sequence

#### 4. Enrollment
- Fields: studentId (ref: User), courseId (ref: Course)
- Links students to courses
- One record per student-course enrollment

#### 5. Test (Quiz)
- Fields: title, courseId (ref: Course), createdBy (ref: User), createdAt
- Created by teachers
- Multiple questions per test

#### 6. Question
- Fields: testId (ref: Test), questionText, options (array), correctAnswer, createdAt
- Multiple choice questions
- Correct answer stored in DB

#### 7. TestResult
- Fields: testId (ref: Test), studentId (ref: User), score (0-100), answers (array with questionId, selectedAnswer, isCorrect), submittedAt
- Student quiz submissions and scores

#### 8. Assignment
- Fields: title, description, courseId (ref: Course), createdBy (ref: User), dueDate, createdAt
- Text-based assignments

#### 9. AssignmentSubmission
- Fields: assignmentId, studentId, answerText, marks, feedback, status (submitted/checked), submittedAt, evaluatedAt, gradedAt
- Student submissions with teacher feedback

#### 10. Progress
- Fields: studentId, courseId, lectureId, completed (boolean), createdAt
- Tracks lecture completion status

#### 11. WatchTime
- Fields: studentId, lectureId, currentTime (seconds), updatedAt
- Resume watching functionality

#### 12. OTP
- For email verification

---

## BACKEND ROUTES

### 1. Auth Routes (`/api/auth`)
- **POST /login** - Login with email/password
- **POST /register** - Register new user (student or teacher only)

### 2. Course Routes (`/api/course`)
- **POST /create** - Create course (teacher only)
- **GET /all** - Get all courses (student only)
- **POST /enroll** - Enroll in course (student only)
- **GET /teacher** - Get teacher's courses (teacher only)
- **GET /enrolled** - Get student's enrolled courses (student only)

### 3. Lecture Routes (`/api/lecture`)
- **POST /create** - Add lecture to course (teacher only)
- **POST /add** - Alt endpoint for adding lecture
- **GET /course/:courseId** - Get course lectures

### 4. Test/Quiz Routes (`/api/test`)
- **POST /create** - Create test (teacher only)
- **POST /question** - Add question to test (teacher only)
- **GET /course/:courseId** - Get quizzes for course
- **GET /:testId** - Get test with questions (hides correct answers)
- **POST /submit** - Submit test answers (student)
- **GET /:testId/results** - Get quiz results (teacher only)

### 5. Assignment Routes (`/api/assignment`)
- **POST /create** - Create assignment (teacher only)
- **GET /course/:courseId** - Get assignments for course
- **POST /submit** - Submit assignment (student only)
- **POST /evaluate** - Grade submission (teacher only)
- **GET /submission/:submissionId** - Get submission details (teacher)
- **GET /:assignmentId/submissions** - Get all submissions (teacher)
- **GET /:assignmentId/my-submission** - Get own submission (student)
- **PUT /submission/:submissionId/grade** - Grade with marks and feedback

### 6. Progress Routes (`/api/progress`)
- **POST /complete** - Mark lecture as completed
- **GET /course/:courseId** - Get course progress
- **GET /summary/:courseId** - Get comprehensive progress summary

### 7. Dashboard Routes (`/api/dashboard`)
- **GET /student** - Student dashboard stats (enrolled courses, quiz average, assignment status)
- **GET /teacher** - Teacher dashboard stats (courses created, students, assignments)

### 8. Certificate Routes (`/api/certificate`)
- **GET /course/:courseId** - Generate PDF certificate (100% completion required)

### 9. Admin Routes (`/api/admin`)
- **GET /stats** - Platform statistics (total users, students, teachers, courses, enrollments)
- **GET /users** - List all users with roles
- **GET /teachers** - List all teachers
- **POST /delete-user/:userId** - Delete user account
- **POST /make-teacher/:userId** - Change user role to teacher

### 10. Watch Time Routes (`/api/watch-time`)
- Update and retrieve watch position for resume functionality

---

## MIDDLEWARE

### authMiddleware
- Verifies JWT token from Authorization header
- Extracts user id and role
- Sets req.user with { id, role }
- Returns 401 if token invalid/expired

### roleMiddleware
- Factory function: roleMiddleware(requiredRole)
- Checks req.user.role matches required role
- Returns 403 if access denied
- Must be used after authMiddleware

---

## FRONTEND STRUCTURE

### Stack
- **Framework**: React 19.2.0
- **Router**: React Router v7
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Vite**: Build tool

### Redux Store

#### auth/authSlice
- State: token, user, role, isAuthenticated
- Actions: setToken, setUser, setRole, logout

#### quiz/quizSlice
- State: quizzes, questions, results
- Actions: setQuizzes, setQuestions, setResults

#### assignment/assignmentSlice
- State: assignments, submissions
- Actions: setAssignments, setSubmissions

### Components

#### ProtectedRoute
- Checks token and isAuthenticated
- Redirects to / if not authenticated

#### RoleProtectedRoute
- Checks user role matches required role
- Redirects if unauthorized

#### RoleLayout
- Main layout wrapper
- Shows appropriate navbar based on role

#### Navigation
- **StudentNavbar** - Student navigation
- **TeacherNavbar** - Teacher navigation
- **AdminNavbar** - Admin navigation

### Pages

#### Auth Pages
- **Login** - Email/password login
- **Register** - User registration with role selection

#### Student Pages
- **Dashboard** - Browse all courses
- **StudentDashboard** - Student learning overview
- **CourseDetail** - View course lectures with video player
- **Quiz** - Take quiz for course
- **QuizResults** - View quiz scores and answers
- **Assignment** - View and submit assignments
- **AssignmentResult** - View assignment marks and feedback
- **ProgressDashboard** - Course progress tracking

#### Teacher Pages
- **TeacherDashboard** - Teaching overview
- **TeacherCourses** - Manage created courses
- **CreateCourse** - Create new course
- **AddLecture** - Add lecture to course
- **CreateQuiz** - Create quiz for course
- **AddQuestion** - Add questions to quiz
- **TeacherQuizzes** - View created quizzes
- **TeacherAssignments** - Manage assignments
- **TeacherSubmissions** - Review student submissions
- **TeacherStudents** - View enrolled students
- **GradeSubmission** - Grade student work

#### Admin Pages
- **AdminDashboard** - Platform overview
- **AdminUsers** - Manage all users
- **AdminTeachers** - Manage teachers
- **AdminCourses** - Manage all courses

### Routing Structure
```
/ - Login (public)
/register - Register (public)
/app/ - Protected routes (requires auth)
  /dashboard - Student browse courses
  /course/:courseId - Course detail with video
  /course/:courseId/quiz/:testId - Take quiz
  /course/:courseId/assignment - Submit assignments
  /course/:courseId/assignment/:assignmentId/result - Assignment result
  /course/:courseId/progress - Course progress
  /student/dashboard - Student overview
  /teacher/dashboard - Teacher overview
  /teacher/courses - Teacher's courses
  /teacher/courses/:courseId - Edit course
  /teacher/lectures/:courseId/add - Add lecture
  /teacher/quizzes/:courseId/create - Create quiz
  /teacher/quizzes/:testId/questions - Add questions
  /teacher/assignments - Manage assignments
  /teacher/assignments/:assignmentId/submissions - View submissions
  /teacher/submissions/:submissionId/grade - Grade submission
  /teacher/students - View students
  /admin/dashboard - Admin overview
  /admin/users - Manage users
  /admin/teachers - Manage teachers
  /admin/courses - Manage courses
```

---

## KEY FEATURES

### Authentication & Authorization
- Email/password login and registration
- JWT token-based authentication (7-day expiry)
- Role-based access control (Student, Teacher, Admin)
- Password hashing with bcrypt

### Course Management
- Teachers create and manage courses
- Students enroll in courses
- Courses can have multiple lectures
- Lectures have video URLs

### Video Learning
- Video player for lectures
- Watch time tracking (resume position)
- Mark lectures as completed
- Progress tracking per course

### Quizzes
- Multiple choice questions
- Auto-grading
- Score tracking
- Teacher can view all student results
- Student can view their results

### Assignments
- Text-based assignments with due dates
- Student submissions with timestamps
- Teacher evaluation with marks and feedback
- Assignment result tracking for students

### Progress Tracking
- Lecture completion status
- Quiz average scores
- Assignment submission status
- Overall course completion percentage
- Certificate generation (100% completion)

### Admin Features
- View platform statistics
- Manage all users
- Change user roles
- Delete accounts
- Monitor courses and enrollments

### PDF Certificates
- Generated when course 100% complete
- Contains student name, course name, completion date
- Professional formatting with decorative borders

---

## IMPORTANT NOTES

### Database & Relationships
- All IDs use MongoDB ObjectId
- Use `.populate()` for referenced data
- Compound queries for complex operations (e.g., student progress calculation)

### API Response Format
- Success: { message, data }
- Error: { message, error? }
- Status codes: 200 (ok), 201 (created), 400 (bad), 401 (auth), 403 (forbidden), 404 (not found), 500 (error)

### Frontend State Management
- Use Redux for auth state
- Use React state for form data
- API calls in useEffect or event handlers

### Security
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT secret from .env
- Role checking on all protected endpoints
- Correct answers hidden from students in quiz endpoints

### Environment Variables
Backend (.env):
- DATABASE_URL
- JWT_SECRET
- PORT
- NODE_ENV

Frontend (.env.local):
- VITE_API_URL (http://localhost:5000)
