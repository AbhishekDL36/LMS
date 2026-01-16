# STEP-10B API Reference - Quick Lookup

Quick reference for all assignment endpoints.

---

## Base URL
```
http://localhost:5000/api/assignment
```

---

## 1. Create Assignment (Teacher)

```
POST /create

Headers:
  Authorization: Bearer {TEACHER_TOKEN}
  Content-Type: application/json

Body:
{
  "title": "Essay on Climate Change",
  "description": "Write a 1000-word essay about climate change and its effects",
  "courseId": "507f1f77bcf86cd799439011",
  "dueDate": "2025-02-15"
}

Response (201):
{
  "message": "Assignment created successfully",
  "assignmentId": "507f1f77bcf86cd799439012"
}

Errors:
  400 - Title is required
  400 - Description is required
  400 - Course ID is required
  400 - Due date is required
  500 - Error creating assignment
```

---

## 2. Get Course Assignments (Student)

```
GET /course/{courseId}

Headers:
  Authorization: Bearer {TOKEN}

URL Parameters:
  courseId - ID of the course

Response (200):
{
  "assignments": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Essay on Climate Change",
      "description": "Write a 1000-word essay...",
      "courseId": "507f1f77bcf86cd799439011",
      "dueDate": "2025-02-15T00:00:00.000Z",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439001",
        "name": "Mr. Smith"
      },
      "createdAt": "2025-01-10T10:30:00.000Z"
    }
  ],
  "totalAssignments": 1
}

Errors:
  500 - Error fetching assignments
```

---

## 3. Submit Assignment (Student)

```
POST /submit

Headers:
  Authorization: Bearer {STUDENT_TOKEN}
  Content-Type: application/json

Body:
{
  "assignmentId": "507f1f77bcf86cd799439012",
  "answerText": "Climate change is a significant threat to our planet. Rising global temperatures are causing melting of ice caps..."
}

Response (201):
{
  "message": "Assignment submitted successfully",
  "submissionId": "507f1f77bcf86cd799439013"
}

Errors:
  400 - Assignment ID is required
  400 - Answer text is required
  400 - You have already submitted this assignment
  404 - Assignment not found
  500 - Error submitting assignment
```

---

## 4. Evaluate Assignment (Teacher)

```
POST /evaluate

Headers:
  Authorization: Bearer {TEACHER_TOKEN}
  Content-Type: application/json

Body:
{
  "submissionId": "507f1f77bcf86cd799439013",
  "marks": 85
}

Response (200):
{
  "message": "Assignment evaluated successfully"
}

Errors:
  400 - Submission ID is required
  400 - Marks are required
  400 - Marks must be a positive number
  404 - Submission not found
  500 - Error evaluating assignment
```

---

## 5. Get All Submissions (Teacher)

```
GET /{assignmentId}/submissions

Headers:
  Authorization: Bearer {TEACHER_TOKEN}

URL Parameters:
  assignmentId - ID of the assignment

Response (200):
{
  "submissions": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "assignmentId": "507f1f77bcf86cd799439012",
      "studentId": {
        "_id": "507f1f77bcf86cd799439002",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "answerText": "Climate change is a significant threat...",
      "marks": 85,
      "status": "checked",
      "submittedAt": "2025-01-15T14:20:00.000Z",
      "evaluatedAt": "2025-01-16T10:00:00.000Z"
    }
  ],
  "totalSubmissions": 1
}

Errors:
  500 - Error fetching submissions
```

---

## 6. Get Own Submission (Student)

```
GET /{assignmentId}/my-submission

Headers:
  Authorization: Bearer {STUDENT_TOKEN}

URL Parameters:
  assignmentId - ID of the assignment

Response (200):
{
  "submission": {
    "_id": "507f1f77bcf86cd799439013",
    "assignmentId": "507f1f77bcf86cd799439012",
    "studentId": "507f1f77bcf86cd799439002",
    "answerText": "Climate change is a significant threat...",
    "marks": 85,
    "status": "checked",
    "submittedAt": "2025-01-15T14:20:00.000Z",
    "evaluatedAt": "2025-01-16T10:00:00.000Z"
  }
}

Errors:
  404 - You have not submitted this assignment
  500 - Error fetching submission
```

---

## Response Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | GET successful, POST update successful |
| 201 | Created | Resource created (POST create) |
| 400 | Bad Request | Invalid input, missing fields |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Server error |

---

## Authentication

All endpoints require JWT token in Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Get Token:** Login with teacher/student credentials
**Token Format:** JWT signed by your backend

---

## Role Requirements

| Endpoint | Role | Notes |
|----------|------|-------|
| POST /create | teacher | Only teachers can create |
| GET /course/:id | any | Students see assignments |
| POST /submit | student | Only students can submit |
| POST /evaluate | teacher | Only teachers can grade |
| GET /:id/submissions | teacher | Only teachers view all |
| GET /:id/my-submission | any | Students see their own |

---

## Common Scenarios

### Scenario 1: Teacher Creates Assignment
```
1. POST /create
   - Title: "Essay on Climate Change"
   - Description: "Write about climate change"
   - CourseId: [course_id]
   - DueDate: "2025-02-15"

2. Returns assignmentId
```

### Scenario 2: Student Submits
```
1. GET /course/[course_id] (to see assignments)
2. POST /submit
   - AssignmentId: [from step 1]
   - AnswerText: "Climate change is..."

3. Returns submissionId
```

### Scenario 3: Teacher Grades
```
1. GET /[assignment_id]/submissions (to see all)
2. POST /evaluate
   - SubmissionId: [from step 1]
   - Marks: 85

3. Returns success
```

### Scenario 4: Student Checks Grade
```
1. GET /[assignment_id]/my-submission

2. Returns submission with marks
```

---

## Error Handling

All errors return JSON with message:
```json
{
  "message": "Descriptive error message"
}
```

**Common Errors:**
- 400 - Missing required field
- 404 - Resource not found
- 401 - Unauthorized (invalid/missing token)
- 403 - Forbidden (role not allowed)
- 500 - Server error

---

## Example Using curl

### Create Assignment
```bash
curl -X POST http://localhost:5000/api/assignment/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "title": "Essay",
    "description": "Write an essay",
    "courseId": "507f1f77bcf86cd799439011",
    "dueDate": "2025-02-15"
  }'
```

### Submit Assignment
```bash
curl -X POST http://localhost:5000/api/assignment/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "assignmentId": "507f1f77bcf86cd799439012",
    "answerText": "My essay text here..."
  }'
```

### Grade Submission
```bash
curl -X POST http://localhost:5000/api/assignment/evaluate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "submissionId": "507f1f77bcf86cd799439013",
    "marks": 85
  }'
```

---

## Database Models

### Assignment
```
_id: ObjectId
title: String
description: String
courseId: ObjectId (Course)
createdBy: ObjectId (User)
dueDate: Date
createdAt: Date
```

### AssignmentSubmission
```
_id: ObjectId
assignmentId: ObjectId (Assignment)
studentId: ObjectId (User)
answerText: String
marks: Number (nullable)
status: String ("submitted" | "checked")
submittedAt: Date
evaluatedAt: Date (nullable)
```

---

## Important Notes

1. **One Submission Per Student:** Each student can only submit once per assignment
2. **Text-Based Only:** No file uploads, just text answers
3. **Manual Grading:** Teachers must manually evaluate and assign marks
4. **Token Required:** All endpoints require authorization token
5. **Role-Based:** Different endpoints for teachers and students

---

**Last Updated:** January 2025
**API Version:** 1.0
**Status:** Complete

See **STEP-10B-ASSIGNMENT-SYSTEM.md** for full documentation.
