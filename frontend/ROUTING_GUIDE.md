# Routing Guide - Modern createBrowserRouter Setup

This guide explains the new routing system using `createBrowserRouter` instead of `BrowserRouter`.

---

## 📁 Files Created/Modified

### New Files
1. **src/components/ProtectedRoute.jsx** - Component for route protection
2. **src/router/router.js** - Router configuration

### Modified Files
1. **src/App.jsx** - Now empty (routing handled elsewhere)
2. **src/main.jsx** - Uses RouterProvider instead of App

---

## 🏗️ How It Works

### Old Way (BrowserRouter)
```
main.jsx
  ↓
App.jsx (renders BrowserRouter)
  ↓
Routes component
  ↓
Route components
```

### New Way (createBrowserRouter) ✨
```
main.jsx (uses RouterProvider)
  ↓
router.js (defines all routes)
  ↓
Route configuration
  ↓
ProtectedRoute component (for auth)
```

---

## 📝 File Breakdown

### 1. src/router/router.js - Route Configuration

```javascript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CourseDetail from '../pages/CourseDetail';
import ProtectedRoute from '../components/ProtectedRoute';

// Create router with all routes
const router = createBrowserRouter([
  // Each route is an object with path and element
  {
    path: '/',
    element: (...), // What to render
  },
  // ... more routes
]);

export default router;
```

**Key Points:**
- Uses `createBrowserRouter()` function
- Accepts array of route objects
- Each route has `path` and `element`
- No `<Routes>` or `<Route>` components

### 2. src/components/ProtectedRoute.jsx - Route Protection

```javascript
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Check token
  const token = localStorage.getItem('authToken');

  // No token → redirect to home
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Has token → render the page
  return children;
}
```

**Key Points:**
- Simple if/else logic
- Checks `localStorage.getItem('authToken')`
- Returns `<Navigate>` if no token
- Returns `children` if token exists

### 3. src/main.jsx - Router Provider

```javascript
import { RouterProvider } from 'react-router-dom'
import router from './router/router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

**Key Points:**
- Uses `RouterProvider` component
- Passes `router` configuration
- Replaces old `App` component
- RouterProvider handles all routing

### 4. src/App.jsx - Empty Component

```javascript
// This file now returns null
// Routing is handled by RouterProvider

export default function App() {
  return null;
}
```

**Key Points:**
- No longer needed
- Kept for file consistency
- All logic moved to router.js

---

## 🗺️ Route Map

```
/                    → Home (redirects to /dashboard or /login)
/login               → Login page (PUBLIC - anyone can access)
/dashboard           → Course list (PROTECTED - need token)
/course/:courseId    → Video player (PROTECTED - need token)
/*                   → 404 (redirects to /)
```

---

## 🔐 How Protection Works

### Flow 1: User Accessing Protected Route With Token ✅

```
User visits /dashboard
        ↓
ProtectedRoute checks localStorage
        ↓
Token found!
        ↓
<Navigate to="/"> returns children (Dashboard)
        ↓
Dashboard component renders
```

### Flow 2: User Accessing Protected Route Without Token ❌

```
User visits /dashboard
        ↓
ProtectedRoute checks localStorage
        ↓
No token!
        ↓
<Navigate to="/" replace /> redirects
        ↓
Home route checks token
        ↓
No token → redirects to /login
        ↓
Login page renders
```

### Flow 3: User Logging In

```
User enters credentials
        ↓
api.post('/auth/login')
        ↓
Response includes token
        ↓
localStorage.setItem('authToken', token)
        ↓
navigate('/dashboard')
        ↓
ProtectedRoute checks token
        ↓
Token found! Dashboard renders
```

---

## 💡 Key Concepts

### createBrowserRouter
```javascript
// Creates router instance with route configuration
const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
]);
```

**Benefits:**
- Modern approach
- Cleaner code
- Easier to configure
- Better TypeScript support (if needed)

### RouterProvider
```javascript
<RouterProvider router={router} />
```

**What it does:**
- Provides router to entire app
- Handles navigation
- Manages browser history
- Replaces BrowserRouter + Routes

### ProtectedRoute Pattern
```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

**How it works:**
- Wrapper component
- Checks authentication
- Renders children or redirects
- Simple and reusable

### Navigate Component
```javascript
<Navigate to="/" replace />
```

**What it does:**
- Programmatic navigation
- `replace` prevents back button issues
- Used when no token found
- Used for redirects

---

## ✏️ How to Add New Routes

### Step 1: Create New Component
```javascript
// src/pages/Settings.jsx
export default function Settings() {
  return <div>Settings Page</div>
}
```

### Step 2: Add to router.js
```javascript
import Settings from '../pages/Settings'

const router = createBrowserRouter([
  // ... existing routes
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
])
```

### Step 3: Create Link
```javascript
import { Link } from 'react-router-dom'

// In any component:
<Link to="/settings">Go to Settings</Link>
```

---

## 🔄 Navigation Methods

### Using Link Component (Best for UI)
```javascript
import { Link } from 'react-router-dom'

<Link to="/dashboard">Dashboard</Link>
<Link to={`/course/${courseId}`}>View Course</Link>
```

### Using useNavigate Hook (Best for Logic)
```javascript
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// After successful login:
navigate('/dashboard')

// Go back:
navigate(-1)
```

### Using Navigate Component (For Redirects)
```javascript
import { Navigate } from 'react-router-dom'

// In route element:
element: <Navigate to="/login" replace />
```

---

## 🎯 Route Protection Strategy

### Current Implementation
```
Check token in localStorage
    ↓
Token exists? → Show page
Token missing? → Redirect to home (/), then to login
```

### Why This Works
1. Simple and easy to understand
2. No complex logic
3. No role checking (all protected routes same)
4. Token-based only
5. Beginner-friendly

### If You Need More Complex Protection
Add parameters to ProtectedRoute:
```javascript
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

But NOT recommended for this project (keep it simple!)

---

## 🐛 Troubleshooting

### Problem: White Page / Nothing Renders
**Check:**
- Is RouterProvider in main.jsx? ✓
- Is router exported from router.js? ✓
- Does router have at least one route? ✓

### Problem: Routes Not Found (404)
**Check:**
- Import correct components? ✓
- Path names correct? ✓
- No typos in routes? ✓

### Problem: Can't Access Protected Route Even With Token
**Check:**
- Token saving to localStorage? (DevTools → Application)
- Token has correct key name? (`authToken`)
- ProtectedRoute checking correct key? ✓

### Problem: Infinite Redirect Loop
**Check:**
- Home route redirects to login or dashboard? ✓
- Login doesn't try to redirect? ✓
- Token exists when accessing protected? ✓

---

## 📚 Using with Components

### In Login.jsx
```javascript
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = async (email, password) => {
    // ... API call
    localStorage.setItem('authToken', token)
    navigate('/dashboard') // Navigate after login
  }
}
```

### In Dashboard.jsx
```javascript
import { Link } from 'react-router-dom'

<Link to={`/course/${course._id}`}>
  View Course
</Link>
```

### In CourseDetail.jsx
```javascript
import { useParams, useNavigate } from 'react-router-dom'

export default function CourseDetail() {
  const { courseId } = useParams() // Get from URL
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/dashboard')
  }
}
```

---

## 🔍 Debugging Routes

### Check Current Route
```javascript
import { useLocation } from 'react-router-dom'

export default function Debug() {
  const location = useLocation()
  console.log('Current path:', location.pathname)
}
```

### Check Route Params
```javascript
import { useParams } from 'react-router-dom'

export default function CourseDetail() {
  const { courseId } = useParams()
  console.log('Course ID:', courseId)
}
```

### Check Authentication
```javascript
const token = localStorage.getItem('authToken')
console.log('Has token:', !!token)
```

---

## 📊 Route Configuration Overview

```javascript
const router = createBrowserRouter([
  // Redirect home based on auth
  {
    path: '/',
    element: (token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />)
  },

  // Login (public)
  {
    path: '/login',
    element: <Login />
  },

  // Dashboard (protected)
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },

  // Course (protected with param)
  {
    path: '/course/:courseId',
    element: <ProtectedRoute><CourseDetail /></ProtectedRoute>
  },

  // 404 (not found)
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])
```

---

## ✅ What You Now Have

- ✅ Modern createBrowserRouter setup
- ✅ Clean route configuration
- ✅ Protected routes with token check
- ✅ Simple, beginner-friendly code
- ✅ Easy to extend
- ✅ No complex patterns

---

## 🎓 Key Takeaways

1. **createBrowserRouter** is the modern way to configure routes
2. **RouterProvider** replaces BrowserRouter + Routes
3. **ProtectedRoute** is a simple wrapper checking for token
4. **Navigate** is used for programmatic redirects
5. **useNavigate** is used for navigation in components
6. **useParams** is used to get URL parameters

---

## 🚀 Next Steps

1. Run `npm run dev` and test the app
2. Try accessing `/dashboard` without logging in
3. Should redirect to `/login`
4. Login, then access `/dashboard`
5. Should show dashboard
6. Click a course to go to `/course/:courseId`
7. Click back to return to dashboard

Everything should work smoothly!

---

**Your routing system is now modern and clean! 🎉**
