# LMS Frontend - Student Dashboard

A simple, beginner-friendly React frontend for students to view courses, watch lectures, and track progress.

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx           # Student login page
│   │   ├── Dashboard.jsx       # List of enrolled courses
│   │   └── CourseDetail.jsx    # Video player and lectures
│   ├── styles/
│   │   ├── Login.css           # Login page styles
│   │   ├── Dashboard.css       # Dashboard styles
│   │   └── CourseDetail.css    # Course detail styles
│   ├── api.js                  # Axios configuration with token handling
│   ├── App.jsx                 # Main app with routing
│   ├── App.css                 # Global app styles
│   ├── index.css               # Global styles
│   └── main.jsx                # React entry point
├── index.html                  # HTML template
├── package.json                # Dependencies
└── vite.config.js              # Vite configuration
```

## Features

### 1. Authentication (Login.jsx)
- Simple email + password form
- Saves token to localStorage
- Auto-attach token to all API requests via axios interceptor
- Redirect to dashboard on success

### 2. Dashboard (Dashboard.jsx)
- Fetch list of enrolled courses
- Display course title and description
- Show progress percentage for each course
- Progress bar visualization
- Click "View Lectures" to go to course detail

### 3. Course Detail (CourseDetail.jsx)
- List of lectures in a sidebar
- HTML5 video player
- Auto-save watch time every 5 seconds
- Manual save on pause
- Mark lecture as completed
- Show completion badge

## Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.x",
  "axios": "^1.x"
}
```

Install with:
```bash
npm install axios react-router-dom
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Update API base URL in `src/api.js`:
   ```javascript
   baseURL: 'http://localhost:5000/api' // Change port if needed
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## How Token Authentication Works

1. **Login**: User submits email/password → Backend returns token
2. **Save Token**: Token is stored in `localStorage.authToken`
3. **Auto-attach**: Axios interceptor automatically adds `Authorization: Bearer <token>` header to every request
4. **Expired Token**: If server returns 401, token is cleared and user is redirected to login

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - Login with email/password
  - Request: `{ email, password }`
  - Response: `{ token, studentId }`

### Courses
- `GET /api/courses/enrolled` - Get enrolled courses
  - Response: `{ courses: [{ _id, title, description, progress }] }`
- `GET /api/courses/{courseId}` - Get course details
  - Response: `{ course: {...}, lectures: [...] }`

### Progress Tracking
- `POST /api/watch-time/save` - Save watch time
  - Request: `{ lectureId, courseId, watchTime, videoDuration }`
- `POST /api/progress/complete` - Mark lecture complete
  - Request: `{ lectureId, courseId }`

## Code Style

- **Simple**: Only uses `useState` and `useEffect` hooks
- **Commented**: Every component has clear comments explaining the code
- **Beginner-friendly**: No Redux, no advanced patterns
- **CSS**: Plain CSS files (no CSS-in-JS or Tailwind)

## Styling

- Gradient login background
- Card-based dashboard layout
- Simple color scheme (blues, greens, reds for actions)
- Responsive design for mobile devices
- Hover effects for better UX

## Notes

- Always run the backend first (STEP-8) before running the frontend
- Make sure both frontend and backend are running on the correct ports
- Clear localStorage if you want to logout and login again
- Lectures won't show if the course has no lectures in the database

## Debugging

If you get CORS errors:
- Make sure backend has CORS enabled
- Check that baseURL in api.js matches your backend URL

If videos don't play:
- Make sure video URLs are correct in the database
- Videos must be accessible from the frontend

If login fails:
- Check that your backend is running
- Verify email and password exist in the database
