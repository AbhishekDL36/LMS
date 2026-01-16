# Example Data Structures

Reference for what data the frontend expects from the backend.

## Login Response

After `POST /api/auth/login`:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOiI2NzM2YTJmNTcwMDEyYTAwMWIyYzNjZDUiLCJpYXQiOjE3MzE2NDcwMzh9.abcdefg",
  "studentId": "6736a2f57001a001b2c3cd5"
}
```

**What frontend does:**
- Saves `token` to `localStorage.authToken`
- Saves `studentId` to `localStorage.studentId`
- Redirects to `/dashboard`

---

## Enrolled Courses Response

From `GET /api/courses/enrolled`:

```json
{
  "courses": [
    {
      "_id": "6736a2f57001a001b2c3cd1",
      "title": "Introduction to React",
      "description": "Learn React from basics to advanced concepts",
      "progress": 45
    },
    {
      "_id": "6736a2f57001a001b2c3cd2",
      "title": "Node.js Backend Development",
      "description": "Build REST APIs with Node.js and Express",
      "progress": 65
    },
    {
      "_id": "6736a2f57001a001b2c3cd3",
      "title": "Database Design with MongoDB",
      "description": "Master MongoDB and data modeling",
      "progress": 20
    }
  ]
}
```

**What frontend does:**
- Maps over courses array
- Displays title and description
- Shows progress as percentage
- Creates clickable card for each course

---

## Course Detail Response

From `GET /api/courses/{courseId}`:

```json
{
  "course": {
    "_id": "6736a2f57001a001b2c3cd1",
    "title": "Introduction to React",
    "description": "Learn React from basics to advanced concepts"
  },
  "lectures": [
    {
      "_id": "6736a2f57001a001b2c3cd6",
      "title": "What is React?",
      "description": "Introduction to React library and JSX",
      "videoUrl": "https://example.com/videos/lecture-1.mp4",
      "isCompleted": true
    },
    {
      "_id": "6736a2f57001a001b2c3cd7",
      "title": "Components and Props",
      "description": "Learn about functional components and passing props",
      "videoUrl": "https://example.com/videos/lecture-2.mp4",
      "isCompleted": false
    },
    {
      "_id": "6736a2f57001a001b2c3cd8",
      "title": "Hooks - useState and useEffect",
      "description": "Master React hooks for state management",
      "videoUrl": "https://example.com/videos/lecture-3.mp4",
      "isCompleted": false
    }
  ]
}
```

**What frontend does:**
- Shows course title as page header
- Lists all lectures in sidebar
- Selects first lecture by default
- Displays video player
- Shows checkmark for completed lectures

---

## Watch Time Save Request

Frontend sends `POST /api/watch-time/save`:

```json
{
  "lectureId": "6736a2f57001a001b2c3cd6",
  "courseId": "6736a2f57001a001b2c3cd1",
  "watchTime": 125,
  "videoDuration": 450
}
```

**Explanation:**
- `lectureId`: Which lecture was watched
- `courseId`: Which course it belongs to
- `watchTime`: How many seconds watched (integer)
- `videoDuration`: Total video length in seconds

**When sent:**
- Every 5 seconds automatically
- When user pauses
- When switching to another lecture

---

## Mark Complete Request

Frontend sends `POST /api/progress/complete`:

```json
{
  "lectureId": "6736a2f57001a001b2c3cd6",
  "courseId": "6736a2f57001a001b2c3cd1"
}
```

**What happens:**
- Backend marks lecture as completed
- Updates student progress percentage
- Frontend shows checkmark next to lecture

---

## Error Responses

Frontend expects errors in this format:

### Login Error
```json
{
  "message": "Invalid email or password"
}
```

Status: 401

### Course Not Found
```json
{
  "message": "Course not found"
}
```

Status: 404

### Unauthorized (Token Expired)
```json
{
  "message": "Token expired"
}
```

Status: 401
Frontend will: Clear token, redirect to login

### Server Error
```json
{
  "message": "Something went wrong"
}
```

Status: 500

---

## Database Structures (Reference)

This shows what should exist in your database:

### Student Document
```json
{
  "_id": "6736a2f57001a001b2c3cd5",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password_here",
  "enrolledCourses": [
    "6736a2f57001a001b2c3cd1",
    "6736a2f57001a001b2c3cd2"
  ]
}
```

### Course Document
```json
{
  "_id": "6736a2f57001a001b2c3cd1",
  "title": "Introduction to React",
  "description": "Learn React from basics to advanced concepts",
  "lectures": [
    "6736a2f57001a001b2c3cd6",
    "6736a2f57001a001b2c3cd7",
    "6736a2f57001a001b2c3cd8"
  ]
}
```

### Lecture Document
```json
{
  "_id": "6736a2f57001a001b2c3cd6",
  "courseId": "6736a2f57001a001b2c3cd1",
  "title": "What is React?",
  "description": "Introduction to React library and JSX",
  "videoUrl": "https://example.com/videos/lecture-1.mp4",
  "order": 1
}
```

### Progress/Watch Document
```json
{
  "_id": "6736a2f57001a001b2c3cd9",
  "studentId": "6736a2f57001a001b2c3cd5",
  "lectureId": "6736a2f57001a001b2c3cd6",
  "courseId": "6736a2f57001a001b2c3cd1",
  "watchTime": 245,
  "isCompleted": false,
  "lastAccessedAt": "2024-01-15T10:30:00Z"
}
```

---

## Making Requests with Postman

### 1. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "studentId": "6736a2f57001a001b2c3cd5"
}
```

### 2. Get Enrolled Courses (copy token from login)
```
GET http://localhost:5000/api/courses/enrolled
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Get Course Details
```
GET http://localhost:5000/api/courses/6736a2f57001a001b2c3cd1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Save Watch Time
```
POST http://localhost:5000/api/watch-time/save
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "lectureId": "6736a2f57001a001b2c3cd6",
  "courseId": "6736a2f57001a001b2c3cd1",
  "watchTime": 125,
  "videoDuration": 450
}
```

### 5. Mark Lecture Complete
```
POST http://localhost:5000/api/progress/complete
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "lectureId": "6736a2f57001a001b2c3cd6",
  "courseId": "6736a2f57001a001b2c3cd1"
}
```

---

## Frontend State Examples

### Dashboard Component State
```javascript
{
  courses: [
    {
      _id: "6736a2f57001a001b2c3cd1",
      title: "Introduction to React",
      description: "Learn React from basics to advanced concepts",
      progress: 45
    }
  ],
  loading: false,
  error: ""
}
```

### CourseDetail Component State
```javascript
{
  course: {
    _id: "6736a2f57001a001b2c3cd1",
    title: "Introduction to React",
    description: "Learn React from basics to advanced concepts"
  },
  lectures: [
    {
      _id: "6736a2f57001a001b2c3cd6",
      title: "What is React?",
      description: "Introduction to React library and JSX",
      videoUrl: "https://example.com/videos/lecture-1.mp4",
      isCompleted: true
    }
  ],
  selectedLecture: {...}, // First lecture
  watchTime: 125,
  loading: false,
  error: ""
}
```

---

## Important Notes

1. **Token Format**: Must be a JWT token. Frontend doesn't validate, just stores and sends it.

2. **Video URLs**: Can be:
   - Direct links: `https://example.com/video.mp4`
   - Relative: `/videos/lecture1.mp4` (if served from backend)
   - Base64 encoded (not recommended for large files)

3. **Progress Calculation**: Frontend receives `progress` percentage. Backend should calculate this based on:
   - `completed_lectures / total_lectures * 100`

4. **CORS**: Backend MUST allow requests from `http://localhost:5173`

5. **Error Messages**: Frontend displays `error.response?.data?.message` to user, so backend error responses MUST have a `message` field.

---

Use this as a reference when building your backend endpoints!
