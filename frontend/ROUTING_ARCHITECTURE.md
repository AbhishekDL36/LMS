# Routing Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Browser                               │
│            http://localhost:5173                         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  index.html                             │
│          <div id="root"></div>                          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│               src/main.jsx                              │
│                                                         │
│  createRoot(root).render(                              │
│    <StrictMode>                                        │
│      <RouterProvider router={router} />               │
│    </StrictMode>                                       │
│  )                                                      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│               src/router/router.js                      │
│                                                         │
│  const router = createBrowserRouter([                  │
│    { path: '/', element: <Navigate> },               │
│    { path: '/login', element: <Login /> },            │
│    { path: '/dashboard', element: <Protected> },      │
│    { path: '/course/:id', element: <Protected> },     │
│  ])                                                     │
└─────────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────┴───────────────┬─────────────┐
        ↓                               ↓             ↓
┌──────────────────┐        ┌──────────────────┐   ┌─────────────┐
│  /login route    │        │ /dashboard route │   │ Protected   │
│  (Public)        │        │ (Protected)      │   │ Routes      │
│                  │        │                  │   │             │
│ <Login />        │        │ <ProtectedRoute> │   │ Check Token │
│                  │        │   <Dashboard />  │   │ If yes →    │
│                  │        │ </ProtectedRoute>│   │   Render    │
└──────────────────┘        └──────────────────┘   │ If no →     │
       ↓                            ↓              │   Redirect  │
    Show form                  Show courses       └─────────────┘
    User enters email/pwd      with progress           ↓
    User clicks login          Logout button      <Navigate to="/" />
    API call to backend        Click course            ↓
    Get token back             Go to detail       Home route checks
    Save to localStorage                         token again
    Redirect to /dashboard
                        ↓
            ┌───────────┴────────────┐
            ↓                        ↓
      Token saved?            No token found?
      ✓ Yes                    ✗ No
            ↓                        ↓
      Render page         Redirect to /login
```

---

## Route Protection Flow

```
┌──────────────────────────────────────────┐
│   User Navigates to /dashboard           │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│  Router finds matching route             │
│  Path: /dashboard                        │
│  Element: <ProtectedRoute>               │
│            <Dashboard />                 │
│           </ProtectedRoute>              │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│   ProtectedRoute Component Runs          │
│   const token = localStorage.get...()    │
└──────────────────────────────────────────┘
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
    Token = null          Token = "..."
        ↓                       ↓
    ┌─────────┐           ┌──────────┐
    │ No Token│           │Has Token │
    └────┬────┘           └────┬─────┘
         ↓                     ↓
   <Navigate                 return
    to="/"                  children
    replace />
         ↓                     ↓
   Home Route      Render
   Checks Token    <Dashboard />
      ↓
   No Token Found
      ↓
   <Navigate
    to="/login"
    replace />
      ↓
   Show Login Page
```

---

## File Organization

```
src/
│
├── router/
│   └── router.js                    ⭐ Main routing config
│       └── createBrowserRouter([
│           { path: '/', ... },
│           { path: '/login', ... },
│           { path: '/dashboard', ... },
│           { path: '/course/:id', ... }
│       ])
│
├── components/
│   └── ProtectedRoute.jsx           ⭐ Auth protection
│       └── Checks localStorage token
│           → render or redirect
│
├── pages/
│   ├── Login.jsx                    Public route
│   ├── Dashboard.jsx                Protected route
│   └── CourseDetail.jsx             Protected route
│
├── main.jsx                         ⭐ Entry point
│   └── <RouterProvider router={router} />
│
└── App.jsx
    └── Empty (routing moved to router.js)
```

---

## Data Flow - User Login to Dashboard

```
Step 1: User Opens App
┌────────────────────┐
│ http://localhost:  │
│ 5173               │
└────────────────────┘
         ↓
Router checks path: /
         ↓
Home route: Check localStorage
         ↓
No token found
         ↓
Navigate to /login
         ↓
┌────────────────────┐
│  Login Page        │
│  Renders           │
│  Email form        │
│  Password form     │
└────────────────────┘

Step 2: User Submits Credentials
┌────────────────────┐
│  api.post(         │
│  /auth/login       │
│  )                 │
└────────────────────┘
         ↓
Backend validates
         ↓
Returns token
         ↓
┌────────────────────┐
│  localStorage.     │
│  setItem(          │
│  'authToken',      │
│  token             │
│  )                 │
└────────────────────┘
         ↓
navigate('/dashboard')
         ↓
Router finds /dashboard route
         ↓
ProtectedRoute checks token
         ↓
Token found!
         ↓
┌────────────────────┐
│  Dashboard Page    │
│  Renders           │
│  Courses list      │
│  Logout button     │
└────────────────────┘

Step 3: User Clicks Course
┌────────────────────┐
│  <Link to={        │
│  `/course/${id}`   │
│  }>                │
└────────────────────┘
         ↓
Router changes path
to /course/abc123
         ↓
ProtectedRoute checks token
         ↓
Token still there!
         ↓
┌────────────────────┐
│  Course Detail     │
│  Page Renders      │
│  Video player      │
│  Lectures list     │
└────────────────────┘

Step 4: User Logs Out
┌────────────────────┐
│  <button onClick=  │
│  handleLogout>     │
└────────────────────┘
         ↓
localStorage.removeItem('authToken')
         ↓
navigate('/')
         ↓
Home route checks token
         ↓
No token found
         ↓
Navigate to /login
         ↓
Login page renders again
```

---

## Component Relationship

```
                    RouterProvider
                          |
                    (uses router config)
                          |
        ┌─────────────────┴──────────────────┐
        |                                    |
    Routes/                           ProtectedRoute
    Components                        Component
        |                                    |
        |                            Checks localStorage
        |                            |
        |                    ┌───────┴─────────┐
        |                    |                 |
    ┌───┴────────┐      Token?          No Token?
    |            |        |                 |
  Login      Dashboard  Render          Redirect
           /             page              to /
         CourseDetail

Dynamic Routing:
/course/:courseId
    ↓
useParams() gets courseId
    ↓
Fetch course from API
    ↓
Display video for that course
```

---

## Authentication & Authorization

```
Current Implementation (Token-Based):

┌─────────────┐
│   Student   │
│   Logs In   │
└──────┬──────┘
       |
       v
   API Call
   POST /api/auth/login
       |
       v
┌─────────────────────┐
│ Server Validates    │
│ Email + Password    │
└──────┬──────────────┘
       |
       v
┌─────────────────────┐
│ Generates JWT Token │
│ Returns to Client   │
└──────┬──────────────┘
       |
       v
┌──────────────────────────────┐
│ Client Stores Token          │
│ localStorage.setItem(        │
│   'authToken', token         │
│ )                            │
└──────┬───────────────────────┘
       |
       v
┌──────────────────────────────┐
│ Subsequent Requests          │
│ Axios Interceptor Adds:      │
│ Authorization: Bearer <token>│
└──────┬───────────────────────┘
       |
       v
┌──────────────────────────────┐
│ Protected Routes Check       │
│ ProtectedRoute component     │
│ checks localStorage for token│
└──────┬───────────────────────┘
       |
   ┌───┴────────┐
   |            |
 Token?      No Token?
   |            |
   v            v
Render       Navigate
Page       to /login
```

---

## URL Patterns

```
/                          → Home (redirect)
                           ↓ (has token) → /dashboard
                           ↓ (no token) → /login

/login                     → Login page (public)

/dashboard                 → Course list (protected)
                           ↓ requires token
                           ↓ shows all courses

/course/abc123             → Video player (protected)
                           ↓ requires token
                           ↓ :courseId is dynamic
                           ↓ useParams() gets courseId

/any-other-path            → Not found
                           ↓ redirects to / (home)
```

---

## Request/Response Cycle with Token

```
┌─────────────┐
│   Component │
│  (Dashboard)│
└──────┬──────┘
       |
       v
useEffect() runs
       |
       v
   api.get()
   '/courses/enrolled'
       |
       v
┌──────────────────────┐
│ Axios Interceptor    │
│ Adds Authorization   │
│ header with token    │
└──────┬───────────────┘
       |
       v
┌──────────────────────┐
│ HTTP Request to      │
│ Backend with Token   │
└──────┬───────────────┘
       |
       v
┌──────────────────────┐
│ Backend Validates    │
│ Token (JWT)          │
└──────┬───────────────┘
       |
   ┌───┴──────────┐
   |              |
Valid         Invalid
   |              |
   v              v
Return       Return 401
Courses      Error
   |              |
   v              v
Axios         Axios Response
Response      Interceptor
   |              |
   v              v
Component    Clear Token
Updates      Navigate to /
State        Redirect to /login
   |
   v
Re-render
with courses
```

---

## Summary

```
OLD (BrowserRouter):
App.jsx → BrowserRouter → Routes → Route → Components

NEW (createBrowserRouter) ✨:
main.jsx → RouterProvider → router.js → createBrowserRouter → Components
                                              ↓
                                        ProtectedRoute (for auth)
```

**Benefits:**
- ✅ Cleaner code
- ✅ Configuration in one place
- ✅ Easier to understand
- ✅ Modern approach
- ✅ Better for scalability

---

**Your routing is now clean and modern! 🎉**
