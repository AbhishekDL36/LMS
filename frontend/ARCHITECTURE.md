# Frontend Architecture & Data Flow

## Component Hierarchy

```
App (main routing component)
├── Login Page
│   ├── Email Input
│   ├── Password Input
│   └── Submit Button
│
├── Dashboard Page
│   ├── Header (with Logout)
│   └── Course Cards Grid
│       └── Course Card (repeated)
│           ├── Title
│           ├── Description
│           └── Progress Bar
│
└── CourseDetail Page
    ├── Header (with Back button)
    ├── Video Section
    │   ├── Video Player
    │   ├── Lecture Title
    │   ├── Lecture Description
    │   └── Mark Complete Button
    └── Lectures Sidebar
        └── Lecture List Items (repeated)
            └── Lecture Button
```

## Application Flow Diagram

```
User Opens App
    ↓
No Token? → Login Page
    ↓
Enter Email & Password
    ↓
POST /api/auth/login
    ↓
Token Received ✓
    ↓
Save to localStorage
    ↓
Redirect to Dashboard
    ↓
GET /api/courses/enrolled
    ↓
Display Courses Grid
    ↓
Click "View Lectures"
    ↓
GET /api/courses/{courseId}
    ↓
Display Video Player
    ↓
User Selects Lecture
    ↓
Load Video
    ↓
User Watches Video
    ↓
Every 5 seconds:
POST /api/watch-time/save
    ↓
User Clicks "Mark Complete"
    ↓
POST /api/progress/complete
    ↓
Show Checkmark ✓
```

## Request/Response Cycle

```
Frontend Component
    ↓
Call: await api.get('/courses/enrolled')
    ↓
axios Interceptor
    ├─ Gets token from localStorage
    └─ Adds: Authorization: Bearer {token}
    ↓
HTTP Request to Backend
    ↓
Backend Validates Token
    ↓
Backend Processes Request
    ↓
HTTP Response
    ↓
axios Response Interceptor
    ├─ Check status code
    ├─ If 401 → Clear token, redirect to login
    └─ Otherwise → Return response
    ↓
Component Receives Data
    ↓
Update State
    ↓
Component Re-renders
```

## State Management Flow

```
Component Mounts
    ↓
useEffect() runs
    ↓
API Call Made
    ↓
Data Arrives
    ↓
setState(data)
    ↓
Component Re-renders
    ↓
User Interacts
    ↓
Event Handler Called
    ↓
setState(newValue)
    ↓
Component Re-renders
    ↓
API Call Made (optional)
    ↓
Repeat...
```

## File Dependencies

```
main.jsx
    ↓
App.jsx
├── pages/Login.jsx
│   └── api.js ← Uses for login
├── pages/Dashboard.jsx
│   └── api.js ← Uses for fetching courses
└── pages/CourseDetail.jsx
    └── api.js ← Uses for course & video tracking

Styles are imported by their respective pages:
Login.jsx → styles/Login.css
Dashboard.jsx → styles/Dashboard.css
CourseDetail.jsx → styles/CourseDetail.css

Global styles:
main.jsx → index.css
App.jsx → App.css
```

## Data Flow for Each Page

### Login Page Flow
```
Input Change
    ↓ setEmail()
State Updates
    ↓
Form Renders New Value
    ↓
User Submits
    ↓
handleLogin()
    ↓
Validation (client-side)
    ↓
api.post('/auth/login', {email, password})
    ↓
Backend Validates
    ↓
Response: {token, studentId}
    ↓
Save to localStorage
    ↓
navigate('/dashboard')
    ↓
React Router Changes Route
    ↓
Dashboard Loads
```

### Dashboard Page Flow
```
Component Mounts
    ↓ useEffect() [empty deps]
Runs Once
    ↓
setLoading(true)
    ↓
api.get('/courses/enrolled')
    ↓ Interceptor adds token
Backend Returns Courses
    ↓
setCourses(data)
    ↓
setLoading(false)
    ↓
Component Re-renders
    ↓
Maps courses → displays cards
    ↓
User Clicks Course
    ↓ navigate('/course/courseId')
```

### CourseDetail Page Flow
```
Component Mounts
    ↓ useEffect() [courseId]
Runs
    ↓
setLoading(true)
    ↓
api.get('/courses/{courseId}')
    ↓ Interceptor adds token
Backend Returns Course & Lectures
    ↓
setCourse(data.course)
setLectures(data.lectures)
    ↓
Select first lecture
    ↓
setLoading(false)
    ↓
Component Re-renders
    ↓
Video Player Loads
    ↓ useEffect() [watchTime]
Interval Created
    ↓
Every 5 seconds:
    ├─ saveWatchTime()
    └─ api.post('/watch-time/save')
        ↓ Interceptor adds token
        ↓ Backend saves watch time
    ↓
Video Paused
    ↓
handlePause()
    ↓
saveWatchTime()
    ↓
Immediate POST request
    ↓
User Clicks Mark Complete
    ↓
handleMarkComplete()
    ↓
api.post('/progress/complete')
    ↓ Interceptor adds token
    ↓ Backend marks lecture complete
    ↓
Update selectedLecture state
    ↓
Show checkmark in UI
```

## localStorage Structure

```
localStorage:
├── authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
└── studentId: "6736a2f57001a001b2c3cd5"
```

**When set:** After successful login
**When cleared:** When logout button clicked or 401 received
**Usage:** Token added to all API requests via interceptor

## Component State Diagram

### Login State
```
Initial:
{
  email: "",
  password: "",
  error: "",
  loading: false
}

During typing:
{
  email: "user@example.com",
  password: "pass",
  error: "",
  loading: false
}

During login:
{
  email: "user@example.com",
  password: "pass",
  error: "",
  loading: true  ← Changed
}

After success:
Redirect to Dashboard
(component unmounts)

After error:
{
  email: "user@example.com",
  password: "pass",
  error: "Invalid credentials",  ← Changed
  loading: false
}
```

### Dashboard State
```
Initial:
{
  courses: [],
  loading: true,
  error: ""
}

Fetching:
{
  courses: [],
  loading: true,
  error: ""
}

After fetch:
{
  courses: [
    {_id, title, description, progress},
    ...
  ],
  loading: false,
  error: ""
}

After error:
{
  courses: [],
  loading: false,
  error: "Failed to load courses"
}
```

### CourseDetail State
```
Initial:
{
  course: null,
  lectures: [],
  selectedLecture: null,
  loading: true,
  error: "",
  watchTime: 0
}

After fetch:
{
  course: {_id, title, description},
  lectures: [{_id, title, videoUrl, ...}, ...],
  selectedLecture: (first lecture),
  loading: false,
  error: "",
  watchTime: 0
}

During video playback:
{
  ...,
  watchTime: 125  ← Updates constantly
}

After mark complete:
{
  ...,
  selectedLecture: {..., isCompleted: true}
}
```

## API Call Sequence

```
Timeline:
─────────────────────────────────────────────────────

0s    Login button clicked
      ↓ api.post('/auth/login', {email, password})
      ↓ Interceptor adds token header
      │ ... network delay ...
      
1s    Backend processes
      ↓ Backend validates email/password
      ↓ Generates JWT token
      
2s    Response received
      ↓ Interceptor checks status (200)
      ↓ Component gets response
      ↓ localStorage.setItem('authToken', token)
      ↓ navigate('/dashboard')

3s    Dashboard loads
      ↓ useEffect runs
      ↓ api.get('/courses/enrolled')
      ↓ Interceptor gets token from localStorage
      ↓ Interceptor adds to Authorization header
      │ ... network delay ...

4s    Backend processes
      ↓ Backend validates token
      ↓ Fetches student's courses
      
5s    Response received
      ↓ Interceptor checks status (200)
      ↓ Component gets data
      ↓ setCourses(data)
      ↓ Renders course cards

6-10s User viewing dashboard

10s   User clicks course
      ↓ navigate('/course/courseId')
      
11s   CourseDetail loads
      ↓ useEffect runs
      ↓ api.get('/courses/{courseId}')
      ↓ ... request/response cycle ...

13s   Video starts playing
      ↓ User watches

18s   useEffect auto-save interval
      ↓ api.post('/watch-time/save')
      ↓ ... request/response ...

23s   Auto-save again
      ↓ ... happens every 5 seconds ...

30s   User pauses video
      ↓ handlePause() called
      ↓ api.post('/watch-time/save')
      ↓ ... immediate request ...

35s   User marks complete
      ↓ handleMarkComplete() called
      ↓ api.post('/progress/complete')
      ↓ ... request/response ...
```

## Rendering Cycle

```
For Dashboard:
───────────────────────────────────

Render 1 (Mount):
  loading = true
  → Shows: "Loading courses..."

API Request Sent...

Response Arrives:
  → setState(courses)
  → setState(loading, false)

Render 2 (Update):
  loading = false
  courses = [...]
  → Shows: Course cards grid

User clicks course:
  → navigate()
  
Render 3 (Unmount):
  Component removed from DOM
  Cleanup runs (if needed)
```

## Error Handling Flow

```
User Submits Form
    ↓
try {
  API Call
}
    ↓
If 401 (Unauthorized):
  ├─ Interceptor catches
  ├─ localStorage.removeItem('authToken')
  └─ window.location.href = '/login'

If other error:
  ├─ catch block runs
  ├─ Extract error message
  ├─ setError(message)
  └─ Display to user

If success:
  └─ Proceed normally
```

## Key Concepts

1. **Interceptor**: Automatically modifies every request/response
2. **Protected Route**: Checks token, blocks access without it
3. **useEffect Dependency**: Controls when effect runs
4. **Controlled Input**: React state controls form inputs
5. **Conditional Rendering**: Show/hide based on state
6. **Navigation**: React Router handles page changes without full reload

---

This architecture keeps things simple while being scalable for future features.
