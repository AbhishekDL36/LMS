# Frontend Testing Guide

## Starting the Frontend

1. Make sure your backend is running on port 5000
2. In the frontend directory, run:
   ```bash
   npm run dev
   ```
3. Open http://localhost:5173 in your browser

## Testing Workflow

### Step 1: Test Login
- Go to http://localhost:5173/login
- Enter a student email and password from your database
- Click "Login"
- Should redirect to /dashboard if successful
- Check browser's DevTools (F12) → Application → LocalStorage to verify token is saved

### Step 2: Test Dashboard
- Should see all enrolled courses for the logged-in student
- Each course shows:
  - Course title
  - Course description
  - Progress bar (0% if no lectures completed)
- Click "View Lectures" on any course

### Step 3: Test Course Detail
- Should see list of lectures on the right side
- Select a lecture to play its video
- Video should load from the URL in the database
- Click "Mark as Completed" to mark lecture complete
- Lectures list should show a checkmark (✓) for completed lectures
- Switch to another lecture and back to see saved progress

### Step 4: Test Watch Time Tracking
- Play a video for a few seconds (wait at least 5 seconds)
- Check the backend database to see if watch_time entry was created
- Pause the video - watch time should be saved immediately
- Stop and close the course, come back - watch time should be preserved

### Step 5: Test Token Expiration
- In your backend, set token expiration to a short time (like 1 minute)
- Wait for token to expire
- Try to access a protected page
- Should automatically redirect to login and clear localStorage

### Step 6: Test Logout
- Click "Logout" button in dashboard
- Should redirect to login page
- localStorage should be cleared

## Common Issues & Solutions

### "Failed to load courses"
- Check if backend is running on port 5000
- Check if CORS is enabled in backend
- Check browser console (F12) for detailed error

### Videos don't play
- Check if video URL in database is correct and accessible
- Video URL should be a direct link to the video file
- Make sure video format is supported by browsers (MP4 preferred)

### Token not saving
- Check browser DevTools → Application → LocalStorage
- Should see `authToken` key with a token value
- If not appearing, check login response in Network tab

### Can't login
- Verify student email/password exist in database
- Check backend logs for errors
- Verify backend /api/auth/login endpoint works with Postman

### Logout not working
- Check that logout button calls handleLogout function
- Verify localStorage.removeItem() is working (check DevTools)

## Browser DevTools Shortcuts

- Open DevTools: `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Network tab: See API calls and responses
- Application tab: Check localStorage and cookies
- Console tab: See JavaScript errors

## Postman Testing (for backend validation)

Before frontend testing, validate backend endpoints:

### Test Login
```
POST http://localhost:5000/api/auth/login
Body: { "email": "student@example.com", "password": "password123" }
Expected: { "token": "...", "studentId": "..." }
```

### Test Get Enrolled Courses
```
GET http://localhost:5000/api/courses/enrolled
Header: Authorization: Bearer <token_from_login>
Expected: { "courses": [...] }
```

### Test Course Detail
```
GET http://localhost:5000/api/courses/<courseId>
Header: Authorization: Bearer <token_from_login>
Expected: { "course": {...}, "lectures": [...] }
```

## Debugging Tips

1. **Check all API responses**: Open DevTools → Network tab → Click each request to see Response
2. **Read error messages**: Error messages from backend appear in login form and dashboard
3. **Check localStorage**: DevTools → Application → LocalStorage → Check authToken value
4. **Monitor Network tab**: Watch for failed requests (red) and see status codes
5. **Console logs**: Add `console.log()` in React components to debug state changes

## Performance Notes

- Videos auto-save every 5 seconds (can be changed in CourseDetail.jsx line 80)
- Dashboard fetches courses once on page load
- Course detail fetches lectures once on page load
- No infinite loops or memory leaks
- Simple code means easy to debug!
