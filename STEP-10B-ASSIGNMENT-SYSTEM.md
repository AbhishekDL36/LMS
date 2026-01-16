# STEP 10B: Assignment System Backend - Documentation

Complete guide to the Assignment system implementation for your LMS backend.

---

## 📦 What Was Implemented

### Models Created (2 files)

1. **models/Assignment.js**
   - Stores assignment metadata
   - Fields: title, description, courseId, createdBy, dueDate

2. **models/AssignmentSubmission.js**
   - Stores student submissions
   - Fields: assignmentId, studentId, answerText, marks, status

### Routes Created (1 file)

**routes/assignment.js**
- POST /create - Create new assignment (teacher only)
- GET /course/:courseId - Get assignments for a course (student)
- POST /submit - Submit assignment (student only)
- POST /evaluate - Grade submission (teacher only)
- GET /:assignmentId/submissions - View all submissions (teacher only)
- GET /:assignmentId/my-submission - View own submission (student)

### Updated Files

**server.js**
- Added assignment routes import
- Registered assignment routes at `/api/assignment`

---

## 🎯 Routes

### A) POST /create (Teacher Only)
- **Endpoint:** `POST /api/assignment/create`
- **Security:** `authMiddleware` + `roleMiddleware('teacher')`
- **Request Body:**
  ```json
  {
    "title": "Essay on Climate Change",
    "description": "Write a 1000-word essay",
    "courseId": "course123",
    "dueDate": "2025-02-15"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Assignment created successfully",
    "assignmentId": "assign123"
  }
  ```
- **Logic:** Teacher creates assignment, `createdBy` is set from `req.user.id`

### B) GET /course/:courseId (Student Can View)
- **Endpoint:** `GET /api/assignment/course/course123`
- **Security:** `authMiddleware`
- **Response:**
  ```json
  {
    "assignments": [
      {
        "_id": "assign123",
        "title": "Essay on Climate Change",
        "description": "Write a 1000-word essay",
        "courseId": "course123",
        "dueDate": "2025-02-15",
        "createdBy": {
          "_id": "teacher1",
          "name": "Mr. Smith"
        },
        "createdAt": "2025-01-10"
      }
    ],
    "totalAssignments": 1
  }
  ```
- **Logic:** Lists all assignments for a course, sorted by due date

### C) POST /submit (Student Takes Assignment)
- **Endpoint:** `POST /api/assignment/submit`
- **Security:** `authMiddleware` + `roleMiddleware('student')`
- **Request Body:**
  ```json
  {
    "assignmentId": "assign123",
    "answerText": "Climate change is a significant threat..."
  }
  ```
- **Response:**
  ```json
  {
    "message": "Assignment submitted successfully",
    "submissionId": "sub123"
  }
  ```
- **Logic:**
  1. Validates assignment exists
  2. Prevents duplicate submissions (one per student)
  3. Saves submission with status "submitted"

### D) POST /evaluate (Teacher Grades)
- **Endpoint:** `POST /api/assignment/evaluate`
- **Security:** `authMiddleware` + `roleMiddleware('teacher')`
- **Request Body:**
  ```json
  {
    "submissionId": "sub123",
    "marks": 85
  }
  ```
- **Response:**
  ```json
  {
    "message": "Assignment evaluated successfully"
  }
  ```
- **Logic:**
  1. Validates submission exists
  2. Updates marks
  3. Changes status from "submitted" to "checked"
  4. Records evaluation timestamp

### E) GET /:assignmentId/submissions (Teacher Views All)
- **Endpoint:** `GET /api/assignment/assign123/submissions`
- **Security:** `authMiddleware` + `roleMiddleware('teacher')`
- **Response:**
  ```json
  {
    "submissions": [
      {
        "_id": "sub123",
        "assignmentId": "assign123",
        "studentId": {
          "_id": "student1",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "answerText": "Climate change is...",
        "marks": 85,
        "status": "checked",
        "submittedAt": "2025-01-15",
        "evaluatedAt": "2025-01-16"
      }
    ],
    "totalSubmissions": 1
  }
  ```
- **Logic:** Shows all submissions for assignment, with student details

### F) GET /:assignmentId/my-submission (Student Views Their Own)
- **Endpoint:** `GET /api/assignment/assign123/my-submission`
- **Security:** `authMiddleware`
- **Response:**
  ```json
  {
    "submission": {
      "_id": "sub123",
      "assignmentId": "assign123",
      "studentId": "student1",
      "answerText": "Climate change is...",
      "marks": 85,
      "status": "checked",
      "submittedAt": "2025-01-15",
      "evaluatedAt": "2025-01-16"
    }
  }
  ```
- **Logic:** Student can only see their own submission

---

## 🔐 Security Features

- **Teacher-Only Routes:** `/create` and `/evaluate` protected by `roleMiddleware('teacher')`
- **Student-Only Routes:** `/submit` protected by `roleMiddleware('student')`
- **Data Protection:** 
  - Students can only view assignments for their enrolled courses
  - Students can only see their own submissions
  - Teachers can see all submissions for their assignments
- **Duplicate Prevention:** A student cannot submit the same assignment twice

---

## 📝 Code Structure

### Assignment Creation Logic
```
1. Validate required fields
2. Check if teacher is authenticated
3. Create Assignment document
4. Save to database
5. Return assignmentId
```

### Submission Logic
```
1. Validate assignment and answer
2. Check if student already submitted
3. Create AssignmentSubmission document
4. Set status to "submitted"
5. Save to database
6. Return submissionId
```

### Evaluation Logic
```
1. Validate submission exists
2. Validate marks value
3. Update submission with marks
4. Change status to "checked"
5. Record evaluation timestamp
6. Save to database
```

---

## 📊 Database Schema

### Assignment Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  courseId: ObjectId (ref: Course),
  createdBy: ObjectId (ref: User),
  dueDate: Date,
  createdAt: Date
}
```

### AssignmentSubmission Collection
```javascript
{
  _id: ObjectId,
  assignmentId: ObjectId (ref: Assignment),
  studentId: ObjectId (ref: User),
  answerText: String,
  marks: Number (null initially),
  status: "submitted" | "checked",
  submittedAt: Date,
  evaluatedAt: Date (null initially)
}
```

---

## 🧪 Testing Guide

### Test with Postman/curl

#### 1. Create Assignment (Teacher)
```bash
curl -X POST http://localhost:5000/api/assignment/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -d '{
    "title": "Essay on Climate Change",
    "description": "Write a 1000-word essay about climate change",
    "courseId": "COURSE_ID",
    "dueDate": "2025-02-15"
  }'
```

#### 2. Get Assignments (Student)
```bash
curl -X GET http://localhost:5000/api/assignment/course/COURSE_ID \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

#### 3. Submit Assignment (Student)
```bash
curl -X POST http://localhost:5000/api/assignment/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -d '{
    "assignmentId": "ASSIGNMENT_ID",
    "answerText": "Climate change is a significant threat to our planet..."
  }'
```

#### 4. Evaluate Assignment (Teacher)
```bash
curl -X POST http://localhost:5000/api/assignment/evaluate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -d '{
    "submissionId": "SUBMISSION_ID",
    "marks": 85
  }'
```

#### 5. View All Submissions (Teacher)
```bash
curl -X GET http://localhost:5000/api/assignment/ASSIGNMENT_ID/submissions \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN"
```

#### 6. View Own Submission (Student)
```bash
curl -X GET http://localhost:5000/api/assignment/ASSIGNMENT_ID/my-submission \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

---

## 📋 Status

```
Models             ✅ Created (2 files)
Routes             ✅ Implemented (6 endpoints)
Security           ✅ Role-based access
Integration        ✅ Added to server.js
Documentation      ✅ Complete
Code Quality       ✅ Beginner-friendly
Text-Based Only    ✅ Yes
Simple & Clear     ✅ Yes
```

**Status:** ✅ COMPLETE
**Ready for Frontend:** ✅ YES (STEP 10B Frontend)

---

## 🎯 What You Can Do Now

1. ✅ Teachers create assignments
2. ✅ Students view assignments
3. ✅ Students submit text answers
4. ✅ Teachers grade submissions
5. ✅ Teachers view all submissions
6. ✅ Students view their grades

---

## 💡 Key Features

### For Teachers
- Create assignments for courses
- Set due dates
- View all student submissions
- Grade submissions with marks
- Track grading status

### For Students
- View assignments for enrolled courses
- Submit text-based answers
- View their own submissions
- See grades when teacher evaluates
- Know submission status

---

## 🔌 Integration Ready

This backend is ready for STEP 10B Frontend to:
- Create assignment form (teacher)
- Assignment list component (student)
- Submission form (student)
- Grading interface (teacher)
- Submission details view (both)

---

## ✨ Best Practices Followed

- ✅ Beginner-friendly code
- ✅ Clear comments throughout
- ✅ Consistent error handling
- ✅ Simple validation
- ✅ No file uploads (text only)
- ✅ No unnecessary complexity
- ✅ Follows existing code patterns
- ✅ Role-based security
- ✅ Clear API responses

---

## 📚 Learning Points

**For Students Learning This Code:**

1. **Models:** Understanding MongoDB schemas with references
2. **Routes:** How to structure CRUD operations
3. **Middleware:** Authentication and authorization
4. **Database:** Querying with populate, finding by multiple fields
5. **REST API:** POST, GET endpoints with proper HTTP status codes
6. **Error Handling:** Validating inputs and returning appropriate errors

---

**Date:** January 2025
**Status:** ✅ Ready to Use
**Next:** STEP 10B Frontend Implementation
