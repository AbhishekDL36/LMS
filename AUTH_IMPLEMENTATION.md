# Complete Authentication System Implementation

## Backend APIs

### 1. Register (Email/Password)
**POST** `/api/auth/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

Response:
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### 2. Login (Email/Password)
**POST** `/api/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### 3. Login with Google
**POST** `/api/auth/google`

Request:
```json
{
  "token": "google_jwt_token_from_frontend",
  "role": "student"
}
```

Response:
```json
{
  "message": "Authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### 4. Get Current User (Protected)
**GET** `/api/auth/me`

Headers:
```
Authorization: Bearer {token}
```

Response:
```json
{
  "user": {
    "id": "123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

## Frontend Implementation

### 1. Redux Auth Slice
Location: `frontend/src/features/authSlice.js`

State structure:
```javascript
{
  token: string,           // JWT token
  user: object,            // User data (id, name, email, role)
  role: string,            // User role (student/teacher/admin)
  isAuthenticated: boolean, // Login status
  loading: boolean,        // Loading state
  error: string,           // Error message
}
```

### 2. Login Page
Location: `frontend/src/pages/Login.jsx`

- Email/password input fields
- Google login button (@react-oauth/google)
- Form validation
- Dispatch loginSuccess/authFailure

### 3. Register Page
Location: `frontend/src/pages/Register.jsx`

- Name, email, password fields
- Role selection (student/teacher)
- Google registration button
- Password confirmation
- Dispatch registerSuccess/authFailure

### 4. Protected Route Component
Location: `frontend/src/components/ProtectedRoute.jsx`

- Checks isAuthenticated from Redux
- Redirects to /login if not authenticated
- Otherwise renders protected page

---

## Role-Based Redirects

After login/register, users are redirected based on their role:

```javascript
// Login successful
if (user.role === 'student') {
  navigate('/app/student/dashboard');
} else if (user.role === 'teacher') {
  navigate('/app/teacher/dashboard');
} else if (user.role === 'admin') {
  navigate('/app/admin/dashboard');
}
```

---

## JWT Token Structure

Token contains:
```javascript
{
  id: "user_id_from_mongodb",
  role: "student" | "teacher" | "admin",
  iat: timestamp,
  exp: timestamp
}
```

Token is:
- Generated on register/login
- Stored in localStorage
- Attached to all API requests as: `Authorization: Bearer {token}`
- Verified on backend for protected routes

---

## Database Schema Changes

### User Model (`backend/models/User.js`)

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (optional - for local auth only),
  role: String (student|teacher|admin),
  emailVerified: Boolean (default: true),
  authProvider: String (local|google),
  googleId: String (optional, unique for Google users),
  createdAt: Date
}
```

Key changes:
- `authProvider`: Tracks if user registered with email or Google
- `googleId`: Only set for Google users
- `password`: Optional (not required for Google users)
- `emailVerified`: Always true (no OTP system)

---

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key_min_32_chars
PORT=5000
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
NODE_ENV=development
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

---

## Security Notes

### What's Implemented
✅ Password hashing with bcryptjs  
✅ JWT-based authentication  
✅ Role-based access control  
✅ Protected routes on frontend & backend  
✅ Token verification on every protected API call  
✅ Auto-verified users (no OTP)  

### Backend Middleware Usage

```javascript
// Protect a route with authentication
router.get('/protected', authMiddleware, (req, res) => {
  // req.user is available here
});

// Protect a route with role check
router.get('/admin', authMiddleware, checkRole('admin'), (req, res) => {
  // Only admins can access
});

// Multiple roles
router.get('/teachers', authMiddleware, checkRole(['teacher', 'admin']), (req, res) => {
  // Teachers and admins can access
});
```

---

## Testing the System

### 1. Test Email Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### 2. Test Email Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer {token}"
```

---

## Frontend Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Create .env.local
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Get Google Client ID
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Create OAuth 2.0 credentials (Web Application)
4. Add http://localhost:5173 as authorized redirect URI
5. Copy Client ID to .env.local

### 4. Run Frontend
```bash
npm run dev
```

---

## Backend Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create .env
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key_min_32_chars
PORT=5000
GOOGLE_CLIENT_ID=same_as_frontend
NODE_ENV=development
```

### 3. Start Backend
```bash
npm run dev
```

---

## Flow Diagram

```
User Registration:
┌─────────────────────────────────────────┐
│ Frontend: Register Page                 │
│ - Enter name, email, password, role     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Backend: /api/auth/register             │
│ - Validate input                        │
│ - Check email exists                    │
│ - Hash password with bcryptjs           │
│ - Create user in MongoDB                │
│ - Generate JWT token                    │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Frontend: Redux Store                   │
│ - Save token to localStorage            │
│ - Save user data                        │
│ - Set isAuthenticated = true            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Role-Based Redirect                     │
│ - student → /app/student/dashboard      │
│ - teacher → /app/teacher/dashboard      │
│ - admin → /app/admin/dashboard          │
└─────────────────────────────────────────┘

User Login (Email):
┌──────────────────────────────────────────┐
│ Frontend: Login Page                     │
│ - Enter email, password                  │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Backend: /api/auth/login                 │
│ - Find user by email                     │
│ - Verify password with bcryptjs          │
│ - Check authProvider == 'local'          │
│ - Generate JWT token                     │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Frontend: Redux + localStorage           │
│ - Save token & user data                 │
│ - Set isAuthenticated = true             │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Role-Based Redirect (same as above)      │
└──────────────────────────────────────────┘

User Login (Google):
┌──────────────────────────────────────────┐
│ Frontend: Click "Continue with Google"   │
│ - Google JWT received                    │
│ - User selects role                      │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Backend: /api/auth/google                │
│ - Verify Google JWT token                │
│ - Check if user exists                   │
│ - If new: Create user (authProvider=google)
│ - If exists: Check authProvider == google
│ - Generate JWT token                     │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Frontend: Redux + localStorage           │
│ - Save token & user data                 │
│ - Set isAuthenticated = true             │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Role-Based Redirect (same as above)      │
└──────────────────────────────────────────┘
```

---

## Admin User Creation

Admin users cannot self-register. They must be created manually:

### Option 1: Via MongoDB
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "hashed_password_from_bcrypt",
  role: "admin",
  emailVerified: true,
  authProvider: "local",
  createdAt: new Date()
})
```

### Option 2: Create Admin API (Protected)
You can create a protected endpoint that only existing admins can use.

---

## Token Lifecycle

1. **Generation**: On successful login/register
   - Include userId and role
   - Expires in 7 days
   
2. **Storage**: In browser localStorage
   - Key: `token`
   - Accessible via JavaScript
   
3. **Usage**: Attached to all API requests
   - Header: `Authorization: Bearer {token}`
   - Automatically added by fetch

4. **Verification**: On backend
   - JWT decoded and verified
   - User data extracted (id, role)
   - Attached to req.user

5. **Expiration**: After 7 days
   - Token becomes invalid
   - User must login again
   - localStorage token is cleared on logout

---

## Error Handling

### Frontend
- Registration errors (email exists, password too short)
- Login errors (invalid credentials)
- Google auth errors
- Network errors
- Token errors (invalid/expired)

### Backend
- Validation errors (missing fields, invalid role)
- Database errors (duplicate email)
- JWT verification errors
- Role authorization errors

All errors return appropriate HTTP status codes:
- 400: Bad request (validation error)
- 401: Unauthorized (invalid credentials/token)
- 403: Forbidden (role not permitted)
- 500: Server error

---

## What's Ready to Use

✅ Complete registration with email/password  
✅ Complete login with email/password  
✅ Google OAuth login/registration  
✅ Redux state management  
✅ LocalStorage persistence  
✅ JWT token generation & verification  
✅ Role-based redirects  
✅ Protected routes  
✅ Password hashing  
✅ Email/password validation  
✅ Admin role protection  
✅ Teacher role protection  

---

## What's NOT Implemented (Optional)

❌ Email verification (OTP)  
❌ Password reset  
❌ Two-factor authentication  
❌ Social login (Facebook, GitHub)  
❌ Rate limiting  
❌ Account lockout after failed attempts  
❌ Session management  
❌ Refresh tokens  

These can be added later as needed.

---

## Next Steps

1. Install dependencies: `npm install` (both frontend & backend)
2. Configure .env files with MongoDB URI and Google Client ID
3. Start backend: `npm run dev` in backend/
4. Start frontend: `npm run dev` in frontend/
5. Open http://localhost:5173 in browser
6. Test registration, login, and Google auth
7. Verify role-based redirects work correctly
