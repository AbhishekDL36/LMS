# STEP-17A: Quick Start Guide

## ⚡ What Was Built (30 seconds)

A **registration page** where new users can sign up as either a **student** or **teacher**.

---

## 🚀 Test Registration (2 Minutes)

### Step 1: Start App
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Step 2: Register as Student
1. Open http://localhost:5173/register
2. Fill form:
   - Name: `John Student`
   - Email: `student@test.com`
   - Password: `password123`
   - Role: `Student` (dropdown)
3. Click "Register"
4. Should see: "Registration successful! Redirecting to login..."
5. Auto-redirects to login page

### Step 3: Register as Teacher
1. Go back to http://localhost:5173/register
2. Fill form:
   - Name: `Jane Teacher`
   - Email: `teacher@test.com`
   - Password: `teacher123`
   - Role: `Teacher` (dropdown)
3. Click "Register"
4. Should see: "Registration successful! Redirecting to login..."

### Step 4: Login with New Account
1. Use student email: `student@test.com` / `password123`
2. Should redirect to: `/student/dashboard`
3. Go back and login with teacher email: `teacher@test.com` / `teacher123`
4. Should redirect to: `/teacher/dashboard`

---

## ✅ What to Check

### Backend ✅
- [x] User saved to database
- [x] Role correctly saved
- [x] Password hashed (not plain text)
- [x] Email uniqueness enforced

### Frontend ✅
- [x] Register page works
- [x] All form inputs work
- [x] Role dropdown works
- [x] Error messages show
- [x] Success message shows
- [x] Redirects to login
- [x] Link from login page works

---

## 🧪 Test Error Cases

### Missing Fields
1. Go to /register
2. Leave "Name" empty
3. Click "Register"
4. Should show: "Please fill in all fields"

### Short Password
1. Fill form with password "123"
2. Click "Register"
3. Should show: "Password must be at least 6 characters"

### Email Already Exists
1. Register with same email twice
2. Second attempt should fail
3. Should show: "User already exists"

---

## 📝 Files Changed

### Created
- `frontend/src/pages/Register.jsx` ← New registration page

### Modified
- `frontend/src/router/router.jsx` ← Added /register route
- `frontend/src/pages/Login.jsx` ← Added "Register here" link

### Backend
- No changes needed (already supports role)

---

## 🎯 Key Features

✅ Role dropdown (Student / Teacher)
✅ Form validation
✅ Success message
✅ Error message
✅ Auto-redirect to login
✅ Link from login page

---

## 💻 Code Locations

### Frontend Files
```
frontend/src/pages/Register.jsx       (120 lines) ← Main file
frontend/src/router/router.jsx        (modified) ← Added route
frontend/src/pages/Login.jsx          (modified) ← Added link
```

### Backend Files
```
backend/routes/auth.js                (already supports role)
backend/models/User.js                (already has role field)
```

---

## 🔄 Complete User Flow

```
1. User at Login page
   ↓
2. Clicks "Don't have an account? Register here"
   ↓
3. Goes to /register page
   ↓
4. Fills form:
   - Name
   - Email
   - Password (min 6 chars)
   - Role (Student or Teacher)
   ↓
5. Clicks "Register"
   ↓
6. Frontend validates form
   ↓
7. Sends to /api/auth/register
   ↓
8. Backend:
   - Checks email doesn't exist
   - Hashes password
   - Saves user with role
   ↓
9. Backend returns success
   ↓
10. Frontend shows success message
    ↓
11. Auto-redirects to login (2 sec)
    ↓
12. User logs in with new account
    ↓
13. Gets redirected based on role:
    - Student → /student/dashboard
    - Teacher → /teacher/dashboard
```

---

## 📱 UI Preview

```
┌─────────────────────────┐
│  LMS Register           │
│  Create a new account   │
├─────────────────────────┤
│                         │
│ Full Name               │
│ [________________]      │
│                         │
│ Email                   │
│ [________________]      │
│                         │
│ Password                │
│ [________________]      │
│                         │
│ Select Your Role        │
│ [Student ▼ ]            │
│ 👨‍🎓 Register as...      │
│                         │
│ [Register]              │
│                         │
│ Already have account?   │
│ Login here              │
│                         │
└─────────────────────────┘
```

---

## ⚠️ Common Issues

### Issue: "User already exists"
**Cause:** Trying to register with same email twice
**Solution:** Use different email each time

### Issue: "Server error. Please try again."
**Cause:** Backend not running or CORS issue
**Solution:** Check backend is running on port 5000

### Issue: Form won't submit
**Cause:** Missing required field
**Solution:** Fill all fields (Name, Email, Password, Role)

### Issue: Password rejected
**Cause:** Less than 6 characters
**Solution:** Use minimum 6 character password

---

## 🎯 Success Indicators

After completing STEP-17A, you should:
- ✅ See registration page at /register
- ✅ Register new user as student/teacher
- ✅ New user appears in database
- ✅ Can login with new account
- ✅ Role-based redirect works
- ✅ "Register here" link visible on login page

---

## 📊 Test Checklist

- [ ] Register page loads
- [ ] Form inputs work
- [ ] Role dropdown works
- [ ] Validation works (missing fields)
- [ ] Validation works (short password)
- [ ] Success message shows
- [ ] Auto-redirect works
- [ ] Student login redirects to /student/dashboard
- [ ] Teacher login redirects to /teacher/dashboard
- [ ] "Register here" link on login page works

---

## 🚀 Next: STEP-17B

Profile management and user info editing.

---

**STEP-17A Status:** ✅ COMPLETE
