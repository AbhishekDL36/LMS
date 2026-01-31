# Admin System Implementation - Complete Guide

## Overview

A production-grade, secure admin system with role-based access control for your MERN LMS.

---

## Backend Implementation

### 1. Updated User Model

Role field now accepts three values:
```javascript
role: {
  type: String,
  enum: ['student', 'teacher', 'admin'],
  default: 'student',
}
```

### 2. New Middleware: adminMiddleware.js

Checks if user role is 'admin'. All admin routes use:
```javascript
router.get('/some-endpoint', authMiddleware, roleMiddleware('admin'), handler);
```

### 3. Secure Admin APIs

#### Create Admin (Backend Only)
```
POST /api/admin/create
Headers: Authorization: Bearer <ADMIN_TOKEN>
Body: { name, email, password }
Response: 201 Created
```

Features:
- Only existing admins can create new admins
- No self-registration allowed
- Auto-verified (emailVerified = true)
- Password hashed with bcryptjs

#### Change User Role
```
PATCH /api/admin/user/:id/role
Headers: Authorization: Bearer <ADMIN_TOKEN>
Body: { role: "student"|"teacher"|"admin" }
Response: 200 OK
```

Features:
- Only admins can change roles
- Validates role value
- Returns updated user

#### Delete User
```
DELETE /api/admin/user/:id
Headers: Authorization: Bearer <ADMIN_TOKEN>
Response: 200 OK
```

Features:
- Only admins can delete users
- Prevents self-deletion
- Returns deleted user info

#### Get All Users
```
GET /api/admin/users
Headers: Authorization: Bearer <ADMIN_TOKEN>
Response: 200 OK
```

#### Get All Teachers
```
GET /api/admin/teachers
Headers: Authorization: Bearer <ADMIN_TOKEN>
Response: 200 OK
```

#### Get All Courses
```
GET /api/admin/courses
Headers: Authorization: Bearer <ADMIN_TOKEN>
Response: 200 OK
```

#### Get Admin Stats
```
GET /api/admin/stats
Headers: Authorization: Bearer <ADMIN_TOKEN>
Response: 200 OK
```

---

## Frontend Implementation

### 1. Updated Login Page

- Handles admin login automatically
- Redirects to `/app/admin/dashboard` for admin role

### 2. Updated Register Page

- Admin role cannot be selected during registration
- Blocks admin self-registration

### 3. RoleProtectedRoute Component

New component that validates user role before rendering:

```javascript
<RoleProtectedRoute requiredRole="admin">
  <AdminDashboard />
</RoleProtectedRoute>
```

Features:
- Checks token in Redux store
- Verifies role matches
- Redirects to role-specific dashboard if unauthorized
- Prevents frontend route manipulation

### 4. Admin Pages

#### AdminDashboard.jsx
Shows statistics:
- Total users
- Total students
- Total teachers
- Total courses
- Total enrollments

Clickable cards navigate to management pages.

#### AdminUsers.jsx
- List all users
- Filter by role (student/teacher/admin)
- Delete user functionality
- Displays name, email, role, registration date

#### AdminTeachers.jsx
- List all teachers
- Shows courses created by each teacher
- Manage teacher accounts

#### AdminCourses.jsx
- List all courses
- Shows creator information
- Manage courses on platform

### 5. Updated Router

All admin routes are wrapped with RoleProtectedRoute:

```javascript
{
  path: 'admin/dashboard',
  element: (
    <RoleProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </RoleProtectedRoute>
  ),
}
```

Same for all admin/*, student/*, and teacher/* routes.

---

## Security Features

### Backend Security

✅ **adminMiddleware** - Checks role === 'admin'
✅ **roleMiddleware** - Validates required role
✅ **authMiddleware** - Verifies JWT token first
✅ **No self-registration** - Admin registration blocked
✅ **No self-deletion** - Admin cannot delete own account
✅ **Password hashing** - bcryptjs with salt 10
✅ **Token validation** - JWT verification required

### Frontend Security

✅ **RoleProtectedRoute** - Component-level role check
✅ **Redux state** - Role stored in Redux (not just localStorage)
✅ **Redirect on unauthorized** - Auto-redirect to role dashboard
✅ **Token in header** - Bearer token in Authorization header
✅ **No localStorage manipulation** - Redux validates token

### Combined Security

**BACKEND TRUSTS NOTHING:**
- All API endpoints verify token
- All API endpoints check role
- Frontend cannot bypass middleware
- Token tampering returns 401/403

**FRONTEND PREVENTS DIRECT ACCESS:**
- RoleProtectedRoute checks before rendering
- Router guards prevent navigation
- Unauthorized users redirected

**BOTH LAYERS WORK TOGETHER:**
- Frontend prevents user navigation mistakes
- Backend prevents malicious API requests
- Defense in depth approach

---

## Access Control Matrix

```
Route                    | Student | Teacher | Admin | Unauth
-------------------------|---------|---------|-------|--------
/                        | ✓       | ✓       | ✓     | ✓
/register                | ✓       | ✓       | ✗     | ✓
/app/student/*           | ✓       | ✗       | ✗     | ✗
/app/teacher/*           | ✗       | ✓       | ✗     | ✗
/app/admin/*             | ✗       | ✗       | ✓     | ✗
/api/admin/*             | 403     | 403     | 200   | 401
/api/teacher/*           | 403     | 200     | ✗     | 401
```

---

## How Admin is Created

### Secure Method (Recommended)

1. First admin created directly in MongoDB:
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: bcrypt.hashSync("password", 10),
  role: "admin",
  emailVerified: true,
  authProvider: "local"
})
```

2. Admin logs in with email/password
3. Admin can create other admins via POST /api/admin/create

### API Method

```bash
curl -X POST http://localhost:5000/api/admin/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "name": "New Admin",
    "email": "newadmin@example.com",
    "password": "secure_password"
  }'
```

---

## Testing Admin System

### 1. Create First Admin (Database)

```javascript
// Connect to MongoDB and insert admin user
```

### 2. Login as Admin

```
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password"
}
```

Response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### 3. Test Admin Routes

```bash
# Get users
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/admin/users

# Get stats
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/admin/stats

# Create admin
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin2","email":"admin2@test.com","password":"pass123"}' \
  http://localhost:5000/api/admin/create
```

### 4. Test Frontend

- Login as admin → redirects to /app/admin/dashboard
- Navigate to /app/student/dashboard → redirects back to admin
- Try to access teacher routes → redirected to admin dashboard

---

## Important Files

### Backend
- `backend/models/User.js` - Updated with admin role
- `backend/middleware/adminMiddleware.js` - NEW
- `backend/routes/admin.js` - Updated with 3 new endpoints

### Frontend
- `frontend/src/pages/Login.jsx` - Updated for admin redirect
- `frontend/src/pages/Register.jsx` - Blocks admin registration
- `frontend/src/components/RoleProtectedRoute.jsx` - NEW
- `frontend/src/router/router.jsx` - Updated with role protection
- `frontend/src/pages/AdminUsers.jsx` - Updated with delete button
- `frontend/src/layouts/RoleLayout.jsx` - Uses Redux for role

---

## Security Checklist

- [x] Admin cannot self-register
- [x] Admin only created by existing admin
- [x] All admin routes protected with roleMiddleware
- [x] All admin routes require authMiddleware first
- [x] Frontend routes wrapped with RoleProtectedRoute
- [x] Student cannot access teacher/admin routes
- [x] Teacher cannot access admin routes
- [x] Admin cannot delete own account
- [x] Password hashed with bcryptjs
- [x] JWT token verified before role check
- [x] Role in JWT token (cannot be modified)
- [x] Redirect on unauthorized access
- [x] 401 for no token, 403 for wrong role

---

## Deployment Notes

1. Create first admin user directly in database (secure)
2. Set strong JWT_SECRET in .env
3. Use HTTPS in production
4. Implement rate limiting on /api/admin/create
5. Log admin actions for audit trail
6. Use httpOnly cookies instead of localStorage (if possible)
7. Implement admin 2FA (optional)

---

## Next Steps

1. Test all admin routes with Postman
2. Test all role-protected routes
3. Try token tampering (should fail)
4. Verify role enforcement on backend
5. Deploy to production with security headers
