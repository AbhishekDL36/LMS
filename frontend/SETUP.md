# LMS Student Frontend Setup

## Installation

```bash
cd frontend
npm install
```

## Running the Project

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
 ├── main.jsx              # Entry point
 ├── App.jsx               # Main app with router
 ├── index.css             # Tailwind CSS
 ├── router/
 │   └── router.js         # createBrowserRouter configuration
 ├── components/
 │   └── ProtectedRoute.jsx # Route protection logic
 ├── pages/
 │   ├── Login.jsx         # Login page
 │   ├── Dashboard.jsx     # Student dashboard
 │   └── CourseDetail.jsx  # Course detail page
 └── utils/
     └── auth.js           # Token management
```

## Features

### 1. Authentication
- **Login** (`/`) - Email and password login
- Token stored in localStorage
- Tokens sent in `Authorization: Bearer` header

### 2. Protected Routes
- Routes protected with `ProtectedRoute` component
- Unauthenticated users redirected to login
- Token validation on all protected pages

### 3. Student Dashboard
- Displays enrolled courses in a card grid
- Shows course title and description
- "Continue Learning" button links to course detail

### 4. Course Detail Page
- Video player with controls
- Lecture list sidebar
- Click lecture to play
- Watch time saved to backend on video pause

## Backend Configuration

All API calls use:
- Base URL: `http://localhost:5000`
- Headers: `Authorization: Bearer {token}`

**Expected Backend Endpoints:**
- `POST /api/auth/login` - User login
- `GET /api/course/enrolled` - Get enrolled courses
- `GET /api/lecture/course/:courseId` - Get course lectures
- `POST /api/watch-time/save` - Save watch time

## Notes

- Uses React Router v6.4+ with `createBrowserRouter`
- No Redux or Context API (state is local)
- Fetch API only (no Axios)
- Tailwind CSS for styling
- Simple, beginner-friendly code
