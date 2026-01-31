# Admin Role - Quick Start Guide

## Overview
A complete Admin role has been implemented with dashboard and management pages for platform oversight.

---

## What's New

### Backend
- ✅ `/api/admin/stats` - Platform statistics
- ✅ `/api/admin/users` - All users
- ✅ `/api/admin/teachers` - Teachers with course counts
- ✅ `/api/admin/courses` - All courses with creators

### Frontend
- ✅ **AdminNavbar.jsx** - Purple navbar with links
- ✅ **AdminDashboard.jsx** - Stat cards + overview
- ✅ **AdminUsers.jsx** - User management table
- ✅ **AdminTeachers.jsx** - Teacher list
- ✅ **AdminCourses.jsx** - Course list

### Routes
```
/app/admin/dashboard  → Stats & overview
/app/admin/users      → All users list
/app/admin/teachers   → All teachers
/app/admin/courses    → All courses
```

---

## Testing

### Setup
1. **Backend running:** `npm start` (backend folder)
2. **Frontend running:** `npm run dev` (frontend folder)
3. **Admin user exists** in database with `role: "admin"`

### Test Flow

**Step 1: Login**
```
URL: http://localhost:5173/
Email: admin@example.com
Password: admin_password
```

**Step 2: See Admin Dashboard**
```
URL: http://localhost:5173/app/admin/dashboard
Should see: Purple navbar "LMS Admin"
Should see: 5 stat cards (Users, Students, Teachers, Courses, Enrollments)
```

**Step 3: Click Cards**
```
Total Users → /app/admin/users
Total Teachers → /app/admin/teachers
Total Courses → /app/admin/courses
```

**Step 4: Verify Data**
```
Users page: Shows all users with roles
Teachers page: Shows teachers with course counts
Courses page: Shows courses with creator info
```

**Step 5: Navigate**
```
Use navbar links to move between pages
Back buttons work
Logout clears session
```

---

## API Testing

### Test Endpoint

**Request:**
```bash
curl -H "Authorization: Bearer {admin-token}" \
  http://localhost:5000/api/admin/stats
```

**Response:**
```json
{
  "message": "Admin stats retrieved successfully",
  "totalUsers": 256,
  "totalStudents": 200,
  "totalTeachers": 50,
  "totalCourses": 45,
  "totalEnrollments": 1250
}
```

---

## Key Features

### Dashboard Cards
| Card | Color | Action |
|------|-------|--------|
| Total Users | Blue | → Users list |
| Total Students | Green | → Users list (filtered) |
| Total Teachers | Orange | → Teachers list |
| Total Courses | Indigo | → Courses list |
| Enrollments | Pink | — |

### Security
- ✅ Admin-only routes protected by roleMiddleware
- ✅ JWT token required
- ✅ Student/teacher cannot access admin pages
- ✅ Admin cannot access student/teacher routes

### UI
- ✅ Purple navbar (distinct from student/teacher)
- ✅ Clickable cards with hover effects
- ✅ Loading states during data fetch
- ✅ Error handling with back button
- ✅ Responsive layout (mobile/tablet/desktop)

---

## Admin Navbar Links

```
LMS Admin (brand)
├─ Dashboard     → /app/admin/dashboard
├─ Users         → /app/admin/users
├─ Teachers      → /app/admin/teachers
├─ Courses       → /app/admin/courses
└─ Logout        → / (login page)
```

---

## File Structure

```
frontend/
├── components/
│   └── AdminNavbar.jsx ✨ NEW
├── pages/
│   ├── AdminDashboard.jsx ✨ NEW
│   ├── AdminUsers.jsx ✨ NEW
│   ├── AdminTeachers.jsx ✨ NEW
│   ├── AdminCourses.jsx ✨ NEW
└── router/
    └── router.jsx ✅ (updated)

backend/
├── routes/
│   ├── admin.js ✨ NEW
│   └── ... (other routes)
└── server.js ✅ (updated)
```

---

## What's Different from Student/Teacher?

### Student
- Blue navbar
- Dashboard with personal stats
- My Courses, Assignments, Quizzes
- Routes: `/app/student/...`

### Teacher
- Orange navbar
- Dashboard with teaching stats
- Course management, grading
- Routes: `/app/teacher/...`

### Admin ✨ NEW
- Purple navbar
- Platform-wide statistics
- User, teacher, course management
- Routes: `/app/admin/...`

---

## Database Note

Admin users must be created manually (or via seed data) with:
```javascript
{
  name: "Admin Name",
  email: "admin@example.com",
  password: "hashed_password",
  role: "admin"  // Must be set to "admin"
}
```

---

## Troubleshooting

### Admin navbar not showing?
- [ ] Check user role in database is "admin"
- [ ] Check localStorage has "userRole" = "admin"
- [ ] Check RoleLayout.jsx has admin condition
- [ ] Refresh page

### API returns 403?
- [ ] Check JWT token is valid
- [ ] Check user role is "admin"
- [ ] Check authMiddleware is running
- [ ] Check roleMiddleware is registered

### Pages show 0 stats?
- [ ] Check MongoDB connection
- [ ] Check users/courses exist in database
- [ ] Check API endpoint is called
- [ ] Check network tab for errors

### Routes 404?
- [ ] Check routes are registered in router.jsx
- [ ] Check imports are present
- [ ] Check pages exist in correct folder
- [ ] Restart frontend dev server

---

## Next Steps

Future enhancements (not yet implemented):
- User blocking/unblocking
- Course deletion
- Teacher suspension
- Audit logs
- Advanced analytics
- Export reports

---

## Summary

✅ **Admin role fully implemented**
✅ **All routes protected**
✅ **Dashboard with statistics**
✅ **User management pages**
✅ **Clean separation from student/teacher**

**Ready for testing!**

For detailed information, see: `ADMIN-ROLE-IMPLEMENTATION.md`
