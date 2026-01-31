# Email/Password Authentication System - Fixed

## What Was Changed

### Backend
1. **User Model** (`backend/models/User.js`)
   - Changed from `name` to `firstName` and `lastName` (separate fields)
   - Password is now required
   - Removed Google OAuth requirement (`googleId` is optional with `sparse: true`)
   - Set `authProvider` default to 'email'

2. **Auth Routes** (`backend/routes/auth.js`)
   - Removed Google OAuth route `/api/auth/google`
   - Added `POST /api/auth/login` endpoint (email/password)
   - Added `POST /api/auth/register` endpoint (email/password with role selection)
   - Both endpoints return user role in response

3. **Dependencies** (`backend/package.json`)
   - Added `bcrypt` for password hashing
   - Removed `google-auth-library`

### Frontend
1. **Login Page** (`frontend/src/pages/Login.jsx`)
   - Email and password input fields
   - Calls `POST /api/auth/login`
   - Properly dispatches role to Redux: `dispatch(setRole(data.user.role))`

2. **Register Page** (`frontend/src/pages/Register.jsx`)
   - First name, last name, email, password, confirm password, role selection
   - Calls `POST /api/auth/register`
   - Properly dispatches role to Redux: `dispatch(setRole(data.user.role))`

## How It Works Now

### Registration Flow
1. User enters: First Name, Last Name, Email, Password, Role (Student/Teacher)
2. Frontend sends to `POST /api/auth/register`
3. Backend creates user with that role
4. Backend returns JWT token and user object with role
5. Frontend stores token and role in localStorage and Redux
6. Frontend redirects to correct dashboard (student/teacher)

### Login Flow
1. User enters: Email, Password
2. Frontend sends to `POST /api/auth/login`
3. Backend verifies credentials and returns token + role
4. Frontend stores token and role in localStorage and Redux
5. Frontend redirects to correct dashboard based on user.role

### Role-Based Access Control
- `RoleProtectedRoute` checks `state.auth.role` from Redux
- Each dashboard (student, teacher, admin) is protected by `<RoleProtectedRoute requiredRole="student">`
- If role doesn't match, user is redirected to their correct dashboard

## Environment Variables (.env)

Keep these:
```
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret_key
```

Remove these (no longer needed):
```
GOOGLE_CLIENT_ID=xxx
REACT_APP_GOOGLE_CLIENT_ID=xxx
```

## Installation & Testing

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Start Backend Server
```bash
npm run dev
```

### 3. Start Frontend
```bash
cd frontend
npm start
```

### 4. Test Registration
1. Go to http://localhost:3000/register
2. Register as:
   - **Student**: John Doe, john@example.com, password123, Role: Student
   - **Teacher**: Jane Smith, jane@example.com, password123, Role: Teacher
3. You should be redirected to respective dashboards

### 5. Test Login
1. Go to http://localhost:3000/ (or login link)
2. Enter email and password from registration
3. Should redirect to your dashboard (student/teacher)

### 6. Test Role Restriction
- Login as student, try to navigate to `/app/teacher/dashboard` - should redirect to student dashboard
- Login as teacher, try to navigate to `/app/student/dashboard` - should redirect to teacher dashboard

## Key Fix for "Only Student Can Access" Issue

The problem was that the role was not being properly set in Redux during login/registration.

**Now Fixed:**
- Both Login and Register pages dispatch `setRole(data.user.role)` 
- Backend returns `role` in the user object
- Redux `authSlice` properly stores the role
- `RoleProtectedRoute` reads from `state.auth.role` and enforces access control

## API Endpoints

### POST /api/auth/register
```json
Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}

Response (201):
{
  "message": "Registration successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### POST /api/auth/login
```json
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

## Debugging Tips

If you still see "Only student can access":
1. Check browser console for errors
2. Open Redux DevTools and check `state.auth.role`
3. Check if localStorage has `role` set correctly
4. Clear browser cache and localStorage, re-login
5. Check browser network tab - does login response include `role`?
