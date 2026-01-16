# Frontend Code Overview

Complete walkthrough of each file and what it does.

## Core Files

### api.js
**Purpose**: Axios configuration and authentication

**Key concepts:**
- Creates axios instance with base URL
- Request interceptor: Automatically adds token to Authorization header
- Response interceptor: Handles 401 errors and redirects to login

**When used**: Every API call imports and uses this

```javascript
// Example: Any file can do this
const response = await api.get('/courses/enrolled');
// Token is automatically attached!
```

### App.jsx
**Purpose**: Main routing component

**Routes:**
- `/login` → Login page (public)
- `/dashboard` → Courses list (protected)
- `/course/:courseId` → Video player (protected)
- `/` → Redirect to /dashboard or /login based on token

**Key component: ProtectedRoute**
- Checks if authToken exists in localStorage
- If no token, redirects to /login
- If token exists, allows access

**Why separate pages**: Keeps code organized and easy to follow

### main.jsx
**Purpose**: Entry point for React app

**What it does:**
1. Imports React and ReactDOM
2. Imports App component
3. Imports global CSS
4. Renders App inside root element

**When to modify**: Only if you want to add global providers or wrappers

---

## Page Components

### Login.jsx
**Purpose**: Student authentication

**State variables:**
- `email`: Email input value
- `password`: Password input value
- `error`: Error message to display
- `loading`: Show loading state during login

**Main function: handleLogin()**
1. Prevent form submission default
2. Clear previous errors
3. Set loading = true
4. Call API: `POST /api/auth/login`
5. Save token to localStorage
6. Redirect to /dashboard

**What to understand:**
- Uses `useNavigate()` hook for navigation
- `try/catch` for error handling
- Form controlled by state (value and onChange)

### Dashboard.jsx
**Purpose**: Show list of student's enrolled courses

**State variables:**
- `courses`: Array of course objects
- `loading`: While fetching courses
- `error`: If fetch fails

**Main functions:**
- `fetchCourses()`: Called on component mount
  - Calls `GET /api/courses/enrolled`
  - Updates courses state
- `handleLogout()`: Clears token and redirects to login

**What each course shows:**
- Title (from course.title)
- Description (from course.description)
- Progress bar (from course.progress)
- Button to view lectures

**Key hook: useEffect()**
- Runs once when component mounts (empty dependency array)
- Calls fetchCourses()

**Responsive design:**
- Grid of cards that wrap on smaller screens
- Each card is 300px minimum width

### CourseDetail.jsx
**Purpose**: Video player and lecture management

**State variables:**
- `course`: Course object (title, etc)
- `lectures`: Array of lecture objects
- `selectedLecture`: Currently playing lecture
- `watchTime`: Current video position in seconds
- `loading`: While fetching data

**Refs (useRef):**
- `videoRef`: Reference to HTML video element (to control playback)
- `saveIntervalRef`: Reference to setInterval for auto-save

**Main functions:**

1. **fetchCourseData()**
   - Called on mount
   - Gets course and lectures from backend
   - Sets first lecture as selected

2. **saveWatchTime()**
   - Calls `POST /api/watch-time/save`
   - Sends: lectureId, courseId, watchTime, videoDuration

3. **handleTimeUpdate()**
   - Runs many times per second (built-in video event)
   - Updates watchTime state from video element

4. **handlePause()**
   - Runs when video is paused
   - Manually saves watch time

5. **handleMarkComplete()**
   - Calls `POST /api/progress/complete`
   - Updates UI to show checkmark
   - Updates selectedLecture state

6. **handleSelectLecture()**
   - Saves current lecture watch time
   - Sets new lecture as selected
   - Resets watchTime to 0

**Key hooks:**
- `useEffect` #1: Fetch course on mount
- `useEffect` #2: Auto-save watch time every 5 seconds

**Important concepts:**
- `videoRef.current`: Access actual HTML video element
- Event handlers: `onTimeUpdate`, `onPause` on video tag
- `setInterval` for periodic saving

---

## Styling

### Global Styles (index.css)
- Font family and colors
- Reset default styles (margin, padding)
- Focus states for inputs
- Error message styles

### Component Styles

**Login.css:**
- Centered form box with gradient background
- Input and button styling
- Error message styling

**Dashboard.css:**
- Header with logout button
- Grid layout for course cards
- Progress bar component
- Responsive grid

**CourseDetail.css:**
- Two-column layout: video + lectures list
- Video player styling
- Lectures sidebar with active state
- Responsive: On mobile, switches to single column
- Hover effects for interactivity

**Key styling patterns:**
- Use `.active` class for selected state
- Hover effects with `:hover` pseudo-class
- Transition effects for smooth animations
- Box shadows for depth

---

## How Data Flows

### Login Flow
```
User submits form
    ↓
handleLogin() calls api.post('/auth/login')
    ↓
Backend returns token
    ↓
Save to localStorage
    ↓
Navigate to /dashboard
```

### Dashboard Flow
```
Component mounts
    ↓
useEffect runs fetchCourses()
    ↓
api.get('/courses/enrolled') (token auto-added)
    ↓
Update courses state
    ↓
Render course cards
```

### Video Tracking Flow
```
User plays video
    ↓
onTimeUpdate fires (many times/sec)
    ↓
Updates watchTime state
    ↓
Every 5 seconds: saveWatchTime() sends to backend
    ↓
User pauses: also saves immediately
```

---

## Common Patterns Used

### Error Handling
```javascript
try {
  const response = await api.get('/...');
  // Success: update state
} catch (err) {
  const msg = err.response?.data?.message || 'Failed';
  setError(msg);
}
```

### Controlled Inputs
```javascript
<input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Conditional Rendering
```javascript
if (loading) return <p>Loading...</p>;
if (error) return <p>{error}</p>;
return <div>Content</div>;
```

### List Rendering with Key
```javascript
{courses.map((course) => (
  <div key={course._id}>{course.title}</div>
))}
```

### Event Handling
```javascript
<button onClick={handleClick}>Click me</button>
```

---

## To Modify

### Change API base URL
- File: `api.js` line 6
- Change `baseURL: 'http://localhost:5000/api'`

### Change auto-save interval
- File: `CourseDetail.jsx` line 80
- Change `5000` (milliseconds) to desired interval

### Change progress bar color
- File: `Dashboard.css` line 108
- Change `.progress-fill` background-color

### Add more pages
- Create new file in `pages/` folder
- Import in `App.jsx`
- Add new route in `<Routes>`
- Use `<Link>` or `useNavigate()` to navigate

### Change login background color
- File: `Login.css` line 5
- Change gradient colors

---

## Testing in Code

### Add debug logs
```javascript
console.log('Courses:', courses);
console.log('Watch time:', watchTime);
```

### Check localStorage
```javascript
console.log(localStorage.getItem('authToken'));
```

### Test API manually (before frontend)
Use Postman:
- POST http://localhost:5000/api/auth/login
- GET http://localhost:5000/api/courses/enrolled (with Bearer token)

---

## Performance Notes

✓ Each component only fetches data once (useEffect with empty dependency)
✓ No unnecessary re-renders
✓ Auto-save is throttled (every 5 seconds, not every keystroke)
✓ Interval is cleaned up when component unmounts
✓ No memory leaks

## Security Notes

✓ Token stored in localStorage (accessible to XSS attacks - OK for learning)
✓ Token automatically sent with all requests
✓ 401 errors trigger logout
✓ Protected routes check for token

**For production**: Use httpOnly cookies instead of localStorage

---

## Files You Might Need to Edit

1. **api.js** - If you change your backend URL or port
2. **App.jsx** - If you add new pages/routes
3. **pages/*.jsx** - If you need to change functionality
4. **styles/*.css** - If you need to change appearance

**Don't edit** unless you know what you're doing:
- main.jsx
- index.css (global styles)

Enjoy building! 🚀
