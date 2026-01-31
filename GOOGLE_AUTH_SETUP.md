# Google OAuth + Email/Password Authentication Setup

## Overview

Simple, clean authentication system with:
- Email + Password registration & login
- Google OAuth sign-in
- Auto-login after registration
- Role-based redirect

---

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

Required packages:
- `express` - Web framework
- `jsonwebtoken` - JWT tokens
- `bcryptjs` - Password hashing
- `mongoose` - Database
- `google-auth-library` - Verify Google tokens
- `dotenv` - Environment variables
- `cors` - Cross-origin support

### 2. Environment Variables

Create `.env` file:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lms

# JWT Secret (use a strong random string)
JWT_SECRET=your_very_secret_key_here_min_32_chars

# Server Port
PORT=5000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Environment
NODE_ENV=development
```

### 3. Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 Credentials (Web Application)
5. Add Authorized Redirect URIs:
   - `http://localhost:5173/login`
   - `http://localhost:5173/register`
   - Your production domain
6. Copy Client ID to `.env` as `GOOGLE_CLIENT_ID`

### 4. API Endpoints

#### POST `/api/auth/register`
Register with email + password (auto-verified, auto-login)

```javascript
{
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "student" // or "teacher"
}
```

Response:
```javascript
{
  message: "Registration successful",
  token: "JWT_TOKEN",
  user: {
    id: "...",
    name: "John Doe",
    email: "john@example.com",
    role: "student"
  }
}
```

#### POST `/api/auth/login`
Login with email + password

```javascript
{
  email: "john@example.com",
  password: "password123"
}
```

Response:
```javascript
{
  message: "Login successful",
  token: "JWT_TOKEN",
  user: {
    id: "...",
    name: "John Doe",
    email: "john@example.com",
    role: "student"
  }
}
```

#### POST `/api/auth/google`
Google OAuth login (auto-creates user if new)

```javascript
{
  token: "GOOGLE_ID_TOKEN"
}
```

Response:
```javascript
{
  message: "Google login successful",
  token: "JWT_TOKEN",
  user: {
    id: "...",
    name: "John Doe",
    email: "john@example.com",
    role: "student"
  }
}
```

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 3. Pages

#### Login.jsx
- Email + password login
- Google Sign-In button
- Redirects to role-based dashboard

#### Register.jsx
- Email + password registration
- Role selection (student/teacher)
- Google Sign-In button
- Single-step (no OTP)
- Auto-redirects after registration

### 4. Redux Auth State

Updated `authSlice.js` provides:
- `setToken(token)` - Save JWT
- `setUser(user)` - Save user info
- `setRole(role)` - Save role
- `logout()` - Clear all data

---

## Authentication Flow

### Email + Password Registration

1. User fills form (name, email, password, role)
2. Frontend validates input
3. Sends POST `/api/auth/register`
4. Backend creates user (auto-verified)
5. Backend generates JWT token
6. Frontend stores token + user info
7. Redux store updated
8. Auto-redirects to role dashboard

### Email + Password Login

1. User enters email + password
2. Frontend validates input
3. Sends POST `/api/auth/login`
4. Backend finds user + checks password
5. On success: generates JWT token
6. Frontend stores token + user info
7. Redux store updated
8. Redirects to role dashboard

### Google Sign-In

1. User clicks "Sign in with Google"
2. Google OAuth popup
3. User authenticates with Google
4. Frontend receives Google ID token
5. Sends POST `/api/auth/google` with token
6. Backend verifies token with Google
7. Creates or logs in user
8. Generates JWT token
9. Frontend auto-redirects to dashboard

---

## Key Features

✅ **No OTP required** - Auto-verified on registration
✅ **Google OAuth** - One-click sign-in
✅ **Auto-login** - After registration, automatically logged in
✅ **Role selection** - Student or Teacher
✅ **Auto-verified** - Email verified automatically
✅ **Password hashing** - bcryptjs with salt 10
✅ **JWT tokens** - 7-day expiration
✅ **Admin blocked** - Cannot self-register as admin
✅ **Clean UI** - Modern design with Tailwind

---

## Testing

### Test Email/Password Registration

```bash
# 1. Start backend
cd backend
npm run dev

# 2. Start frontend
cd frontend
npm run dev

# 3. Go to http://localhost:5173/register
# 4. Fill form and submit
# 5. Should auto-redirect to dashboard
```

### Test Email/Password Login

```bash
# 1. Go to http://localhost:5173/login
# 2. Use credentials from registration
# 3. Should redirect to dashboard
```

### Test Google Sign-In

```bash
# 1. Click "Sign in with Google"
# 2. Authenticate with Google account
# 3. Should auto-redirect to dashboard
```

### Test with Postman

**Register:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "test@1234",
  "role": "student"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@test.com",
  "password": "test@1234"
}
```

---

## Security Features

✅ **Password hashing** - bcryptjs (10 rounds)
✅ **JWT validation** - Token verified before use
✅ **CORS enabled** - Only allow frontend origin
✅ **Input validation** - Email format, password length
✅ **Auto-verified** - No email verification needed
✅ **Google verification** - Token verified with Google API
✅ **Role in token** - Cannot be modified by client
✅ **httpOnly ready** - Can switch to cookies later

---

## API Routes Protected

All admin routes:
```javascript
router.get('/admin/users', authMiddleware, roleMiddleware('admin'), handler);
```

All teacher routes:
```javascript
router.get('/teacher/courses', authMiddleware, roleMiddleware('teacher'), handler);
```

---

## Troubleshooting

### Google Sign-In Not Working
- Check GOOGLE_CLIENT_ID in .env
- Verify redirect URIs in Google Cloud Console
- Check browser console for errors

### Registration/Login Fails
- Check MongoDB connection (MONGO_URI)
- Check JWT_SECRET is set
- Check backend is running on PORT 5000

### Token Issues
- Clear localStorage and try again
- Check token exists in Redux store
- Check Authorization header format: `Bearer <TOKEN>`

### CORS Errors
- Ensure backend CORS allows frontend origin
- Check frontend URL in browser

---

## Production Checklist

- [ ] Change JWT_SECRET to random string
- [ ] Use HTTPS in production
- [ ] Update redirect URIs in Google Console
- [ ] Use environment variables for all secrets
- [ ] Implement rate limiting on auth endpoints
- [ ] Add request logging
- [ ] Monitor failed login attempts
- [ ] Use httpOnly cookies instead of localStorage (optional)
- [ ] Enable CSRF protection
- [ ] Set secure cookie flags

---

## Files Modified

### Backend
- ✅ `routes/auth.js` - Simplified (no OTP)
- ✅ `models/User.js` - emailVerified default true
- ✅ `package.json` - Removed nodemailer
- ✅ `.env.example` - Updated for Google OAuth

### Frontend
- ✅ `pages/Login.jsx` - Removed OTP logic
- ✅ `pages/Register.jsx` - Single-step form
- ✅ `features/auth/authSlice.js` - Updated actions
- ✅ `.env.example` - Added GOOGLE_CLIENT_ID

---

## Next Steps

1. Set up MongoDB (Atlas or local)
2. Create Google OAuth credentials
3. Configure `.env` files
4. Install backend dependencies: `npm install`
5. Start backend: `npm run dev`
6. Install frontend dependencies: `npm install`
7. Start frontend: `npm run dev`
8. Test registration and login
9. Test Google Sign-In
10. Deploy to production

---

**Ready to use! Clean, simple, and secure authentication.** ✅
