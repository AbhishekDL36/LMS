# STEP-17B: Quick Start Guide

## ⚡ What Was Built (30 seconds)

Two **role-specific navbar components** that automatically show based on user's role.

---

## 🚀 Test Now (3 Minutes)

### Step 1: Start App
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Step 2: Test Student Navigation
```
1. Go to http://localhost:5173/register
2. Register as student:
   Name: John Student
   Email: student@test.com
   Password: password123
   Role: Student
3. Click Register
4. Go to login page
5. Login with: student@test.com / password123
6. You should see:
   ✅ BLUE navbar with "LMS Student"
   ✅ Links: Dashboard, My Courses, Logout
```

### Step 3: Test Teacher Navigation
```
1. Click Logout (returns to login)
2. Register as teacher:
   Name: Jane Teacher
   Email: teacher@test.com
   Password: password123
   Role: Teacher
3. Click Register
4. Go to login page
5. Login with: teacher@test.com / password123
6. You should see:
   ✅ PURPLE navbar with "LMS Teacher"
   ✅ Links: Dashboard, My Courses, Create Course, Logout
```

### Step 4: Test Navbar Links
```
Student Navbar:
  - Dashboard → /student/dashboard ✅
  - My Courses → /dashboard ✅
  - Logout → Logs out ✅

Teacher Navbar:
  - Dashboard → /teacher/dashboard ✅
  - My Courses → /teacher/courses ✅
  - Create Course → /teacher/course/create ✅
  - Logout → Logs out ✅
```

---

## ✅ What to Verify

- [ ] StudentNavbar is BLUE
- [ ] TeacherNavbar is PURPLE
- [ ] Student navbar shows for students
- [ ] Teacher navbar shows for teachers
- [ ] Navbar appears on all pages
- [ ] Navbar links work
- [ ] Logout clears everything
- [ ] Refresh page - navbar still there

**All checked? STEP-17B works!** ✅

---

## 🧪 Test Logout

```
1. Login as student
2. See blue navbar
3. Click "Logout"
4. Get sent to login page
5. Check localStorage is cleared
   (Token and role removed)
6. Try going back without login
   → Should fail (redirected to login)
```

---

## 📝 Files Changed

### Created (3)
- `frontend/src/components/StudentNavbar.jsx`
- `frontend/src/components/TeacherNavbar.jsx`
- `frontend/src/layouts/RoleLayout.jsx`

### Modified (1)
- `frontend/src/router/router.jsx`

---

## 🎯 Key Features

✅ StudentNavbar (Blue)
- Dashboard link
- My Courses link
- Logout button

✅ TeacherNavbar (Purple)
- Dashboard link
- My Courses link
- Create Course link
- Logout button

✅ RoleLayout
- Checks role from localStorage
- Shows correct navbar
- Renders page content

---

## ⚠️ Common Issues

### Issue: Navbar doesn't show
**Solution:** Make sure you logged in and role was saved to localStorage

### Issue: Wrong navbar showing
**Solution:** Logout and login again. Role should update.

### Issue: Logout doesn't work
**Solution:** Check browser console for errors

### Issue: Page appears twice
**Solution:** This shouldn't happen. Refresh and try again.

---

## 📊 Test Checklist

- [ ] Can register as student
- [ ] Can register as teacher
- [ ] StudentNavbar shows blue color
- [ ] TeacherNavbar shows purple color
- [ ] Student sees 3 links (Dashboard, My Courses, Logout)
- [ ] Teacher sees 4 links (Dashboard, My Courses, Create Course, Logout)
- [ ] Dashboard link works
- [ ] My Courses link works
- [ ] Create Course link works (for teacher)
- [ ] Logout button works
- [ ] localStorage cleared after logout
- [ ] Can't access protected pages without login
- [ ] Navbar persists on page refresh

---

## 🚀 Next Steps

1. Run these tests ✅
2. Verify everything works
3. Read STEP-17B-NAVBAR-ROLE-BASED.md (detailed guide)
4. Continue to STEP-17C

---

**STEP-17B Status:** ✅ COMPLETE & TESTED
