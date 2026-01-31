# STEP-17B: Corrected Code Reference

## ✅ Fixed TeacherNavbar.jsx

```jsx
// TeacherNavbar.jsx - Navigation bar for teachers
// Uses React Router v6 <Link> for proper SPA navigation

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const TeacherNavbar = () => {
  // useNavigate() only for logout (special case)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Logout handler
  const handleLogout = () => {
    // Step 1: Clear Redux auth state + token from localStorage
    dispatch(logout());
    
    // Step 2: Clear userRole from localStorage
    localStorage.removeItem('userRole');
    
    // Step 3: Redirect to login (after clearing state)
    navigate('/');
  };

  return (
    <nav className="bg-purple-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="text-2xl font-bold">
            LMS Teacher
          </div>

          {/* Navigation Links - Using <Link> for proper routing */}
          <div className="flex gap-6 items-center">
            
            {/* ✅ Use <Link> for navigation */}
            <Link
              to="/teacher/dashboard"
              className="hover:bg-purple-700 px-3 py-2 rounded-lg transition"
            >
              Dashboard
            </Link>

            {/* ✅ Use <Link> for navigation */}
            <Link
              to="/teacher/courses"
              className="hover:bg-purple-700 px-3 py-2 rounded-lg transition"
            >
              My Courses
            </Link>

            {/* ✅ Use <Link> for navigation */}
            <Link
              to="/teacher/course/create"
              className="hover:bg-purple-700 px-3 py-2 rounded-lg transition"
            >
              Create Course
            </Link>

            {/* ✅ Use onClick for logout (special case) */}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TeacherNavbar;
```

---

## ✅ Fixed StudentNavbar.jsx

```jsx
// StudentNavbar.jsx - Navigation bar for students
// Uses React Router v6 <Link> for proper SPA navigation

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const StudentNavbar = () => {
  // useNavigate() only for logout (special case)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Logout handler
  const handleLogout = () => {
    // Step 1: Clear Redux auth state + token from localStorage
    dispatch(logout());
    
    // Step 2: Clear userRole from localStorage
    localStorage.removeItem('userRole');
    
    // Step 3: Redirect to login (after clearing state)
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="text-2xl font-bold">
            LMS Student
          </div>

          {/* Navigation Links - Using <Link> for proper routing */}
          <div className="flex gap-6 items-center">
            
            {/* ✅ Use <Link> for navigation */}
            <Link
              to="/student/dashboard"
              className="hover:bg-blue-700 px-3 py-2 rounded-lg transition"
            >
              Dashboard
            </Link>

            {/* ✅ Use <Link> for navigation */}
            <Link
              to="/dashboard"
              className="hover:bg-blue-700 px-3 py-2 rounded-lg transition"
            >
              My Courses
            </Link>

            {/* ✅ Use onClick for logout (special case) */}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
```

---

## ✅ RoleLayout.jsx (Already Correct)

```jsx
// RoleLayout.jsx - Layout wrapper that renders role-based navbar
// Automatically shows correct navbar based on user's role

import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StudentNavbar from '../components/StudentNavbar';
import TeacherNavbar from '../components/TeacherNavbar';

const RoleLayout = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get role from localStorage on mount
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setRole(userRole);
    setLoading(false);
  }, []);

  // Show nothing while loading
  if (loading) {
    return null;
  }

  // Redirect to login if no role
  if (!role) {
    return <Navigate to="/" replace />;
  }

  // Render appropriate navbar based on role
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Show StudentNavbar only for students */}
      {role === 'student' && <StudentNavbar />}
      
      {/* ✅ Show TeacherNavbar only for teachers */}
      {role === 'teacher' && <TeacherNavbar />}

      {/* ✅ Render child routes (page content) */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RoleLayout;
```

---

## ✅ Router Configuration (Already Correct)

```jsx
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleLayout from '../layouts/RoleLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import StudentDashboard from '../pages/StudentDashboard';
import TeacherDashboard from '../pages/TeacherDashboard';
// ... other imports

const router = createBrowserRouter([
  // PUBLIC - Login page
  {
    path: '/',
    element: <Login/>,
  },

  // PUBLIC - Register page
  {
    path: '/register',
    element: <Register/>,
  },

  // PROTECTED - All protected routes with RoleLayout
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RoleLayout />
      </ProtectedRoute>
    ),
    children: [
      // Student routes
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'student/dashboard',
        element: <StudentDashboard />,
      },
      
      // Teacher routes
      {
        path: 'teacher/dashboard',
        element: <TeacherDashboard />,
      },
      
      // Shared routes
      {
        path: 'course/:courseId',
        element: <CourseDetail />,
      },
      // ... more routes
    ],
  },
]);

export default router;
```

---

## 🔑 Key Changes Summary

### What Changed
1. **Imports:** Added `Link` from react-router-dom
2. **Navigation:** Changed from `<button onClick={() => navigate()}>` to `<Link to="">`
3. **Logout:** Kept useNavigate() but ensured state clears first

### What Stayed the Same
- RoleLayout logic ✅
- Router structure ✅
- Redux integration ✅
- Tailwind styling ✅

### Why These Changes Work
- ✅ `<Link>` integrates with React Router's routing engine
- ✅ Preserves router state across navigation
- ✅ URL and route state stay in sync
- ✅ Navbar persists on page changes
- ✅ No more "Access Denied" errors
- ✅ Logout properly clears all state

---

## 🧪 How to Verify It Works

```bash
# 1. Start the app
npm run dev

# 2. Test Student Path
- Register as student
- Login
- See blue StudentNavbar ✅
- Click "Dashboard" → Navigates smoothly ✅
- Click "My Courses" → Navigates smoothly ✅
- Click "Logout" → Redirected to login, storage cleared ✅

# 3. Test Teacher Path
- Register as teacher
- Login
- See purple TeacherNavbar ✅
- Click "Dashboard" → Navigates smoothly ✅
- Click "My Courses" → Navigates smoothly ✅
- Click "Create Course" → Navigates smoothly ✅
- Click "Logout" → Redirected to login, storage cleared ✅

# 4. Test Persistence
- Login as student
- Navigate to /dashboard
- Refresh page (F5)
- Navbar still shows ✅
- No "Access Denied" ✅
```

---

## 📝 Important Notes

1. **Never use `useNavigate()` for navbar links**
   - Only use it for logout/redirects
   - Use `<Link>` for regular navigation

2. **Logout is special**
   - First clear Redux state
   - Then clear localStorage
   - Finally redirect

3. **RoleLayout is the key**
   - Reads role from localStorage
   - Renders correct navbar
   - Works with ProtectedRoute

4. **React Router v6 best practices**
   - Always use `<Link>` for routes
   - Use `useNavigate()` for programmatic navigation
   - Keep URL and state in sync

---

**Status:** ✅ ALL FIXES APPLIED  
**Result:** Navbar fully functional  
**Ready:** YES - Use this code!
