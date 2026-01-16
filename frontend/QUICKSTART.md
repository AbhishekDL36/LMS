# Quick Start Guide - 5 Minutes

## Prerequisites
- Backend running on `http://localhost:5000`
- Node.js installed
- Code editor (VS Code recommended)

## Installation (1 minute)

```bash
cd frontend
npm install
```

Done! All dependencies are now ready.

## Configuration (30 seconds)

Open `src/api.js` and verify the base URL:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // ← Check this matches your backend
```

If your backend is on a different port, change it here.

## Run the App (30 seconds)

```bash
npm run dev
```

You should see:
```
VITE v7.2.4  ready in 245 ms

➜  Local:   http://localhost:5173/
```

Open `http://localhost:5173` in your browser.

## First Time Login (1 minute)

You should see the login page. Enter any student credentials from your database:

Example:
- Email: `student@example.com`
- Password: `password123`

If you get "Login failed":
1. Check backend is running (`npm run dev` in backend folder)
2. Verify email/password exist in database
3. Open DevTools (F12) → Network tab → See what error backend returns

## Expected Screens

### ✓ Success Flow
```
Login Page
    ↓ (enter credentials)
    ↓ (click Login)
Dashboard Page
    ↓ (shows your courses)
    ↓ (click View Lectures)
Course Detail Page
    ↓ (video player)
    ↓ (lecture list)
```

### ✗ If Something Fails

**Can't connect to backend:**
- Make sure backend is running: `npm run dev` in `/backend`
- Check backend is on port 5000
- Update `baseURL` in `src/api.js`

**Login fails:**
- Check email/password in database
- Look at error message in form
- Open DevTools → Network → See response details

**No courses showing:**
- Student might not be enrolled in any courses
- Check database: student should have courses in `enrolledCourses` array

**Videos don't play:**
- Check video URL in database
- Video URL must be accessible from browser (not localhost if not running locally)

## File You Might Need to Edit

Only one file for basic setup:

**`src/api.js` - Line 6**
```javascript
baseURL: 'http://localhost:5000/api' // ← Change if your backend port is different
```

That's it! Everything else is pre-configured.

## Code Organization

```
frontend/src/
├── pages/
│   ├── Login.jsx           ← Login form
│   ├── Dashboard.jsx       ← List of courses
│   └── CourseDetail.jsx    ← Video player
├── styles/
│   ├── Login.css
│   ├── Dashboard.css
│   └── CourseDetail.css
├── api.js                  ← API configuration ⬅️ Only file to change
├── App.jsx                 ← Main app routing
└── main.jsx                ← Entry point
```

## Common Tasks

### Want to change colors?
Edit the `.css` files:
- `src/styles/Login.css` - Login page colors
- `src/styles/Dashboard.css` - Course cards colors
- `src/styles/CourseDetail.css` - Video player colors

### Want to add another page?
1. Create `src/pages/NewPage.jsx`
2. Import in `src/App.jsx`
3. Add route in `<Routes>` section

### Want to change auto-save interval?
Edit `src/pages/CourseDetail.jsx` line 80:
```javascript
saveIntervalRef.current = setInterval(() => {
  saveWatchTime();
}, 5000); // ← Change 5000 (milliseconds)
```

### Want to debug API calls?
Open DevTools (F12) → Network tab:
- See all API requests
- Click any request to see response
- Check Authorization header

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for linting issues
npm run lint
```

## Testing Checklist

After startup, verify:
- [ ] Can see login page at http://localhost:5173
- [ ] Can login with student credentials
- [ ] Redirects to dashboard
- [ ] Dashboard shows courses
- [ ] Can click "View Lectures"
- [ ] Course detail page loads
- [ ] Video player appears
- [ ] Can click lectures in sidebar
- [ ] Lecture changes when clicked
- [ ] Progress bar shows

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot GET /" | Frontend not running, run `npm run dev` |
| CORS error | Backend needs CORS enabled, check STEP-8 |
| Blank page | Check DevTools console (F12) for errors |
| Videos black | Check video URL in database |
| Token not saving | Check login response in Network tab |
| Logout not working | Check localStorage cleared (DevTools → Application) |

## Next: What the Backend Needs

Make sure your backend (STEP-8) has these endpoints:

- ✓ `POST /api/auth/login`
- ✓ `GET /api/courses/enrolled`
- ✓ `GET /api/courses/:courseId`
- ✓ `POST /api/watch-time/save`
- ✓ `POST /api/progress/complete`
- ✓ CORS enabled for `http://localhost:5173`

## Files to Read for More Info

- **FRONTEND_SETUP.md** - Detailed API reference
- **CODE_OVERVIEW.md** - How every component works
- **TESTING_GUIDE.md** - How to test the frontend
- **EXAMPLE_DATA.md** - What data format backend should return
- **ARCHITECTURE.md** - Detailed flow diagrams

## Done!

Your frontend is ready! You can now:
1. Test login/logout
2. View courses
3. Watch lectures
4. Track progress

Happy coding! 🎉

---

**Next Steps:**
- Make sure STEP-8 (backend) is complete
- Test all API endpoints with Postman first (before debugging in frontend)
- Use DevTools extensively (F12 is your best friend)
