# Routing Quick Reference Card

## File Structure
```
src/
├── router/
│   └── router.js                ← All routes configured here
├── components/
│   └── ProtectedRoute.jsx       ← Token check wrapper
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── CourseDetail.jsx
├── main.jsx                      ← Uses RouterProvider
└── App.jsx                       ← Now empty
```

---

## Routes at a Glance

| Path | Component | Protected? | Purpose |
|------|-----------|-----------|---------|
| `/` | Navigate | No | Home (redirects based on token) |
| `/login` | Login | No | Student login form |
| `/dashboard` | Dashboard | ✅ Yes | Course list |
| `/course/:courseId` | CourseDetail | ✅ Yes | Video player |
| `*` | Navigate | No | 404 (redirects home) |

---

## Code Snippets

### Navigate to a Page (in component)
```javascript
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate('/dashboard')
```

### Link to a Page (in JSX)
```javascript
import { Link } from 'react-router-dom'

<Link to="/dashboard">Go to Dashboard</Link>
<Link to={`/course/${id}`}>View Course</Link>
```

### Get URL Parameter
```javascript
import { useParams } from 'react-router-dom'

const { courseId } = useParams()
```

### Check Current Path
```javascript
import { useLocation } from 'react-router-dom'

const location = useLocation()
// location.pathname = current path
```

---

## How Protection Works

```
ProtectedRoute Component:
  if (no token) → <Navigate to="/" />
  if (token) → return children
```

---

## Adding a New Route

1. Create component: `src/pages/NewPage.jsx`
2. Import in `router.js`
3. Add to router:
```javascript
{
  path: '/new-page',
  element: <ProtectedRoute><NewPage /></ProtectedRoute>
}
```
4. Use in component:
```javascript
<Link to="/new-page">Go</Link>
// or
navigate('/new-page')
```

---

## Key Functions

| Function | Use | Example |
|----------|-----|---------|
| `useNavigate()` | Programmatic navigation | `navigate('/dashboard')` |
| `useParams()` | Get URL parameters | `const { id } = useParams()` |
| `useLocation()` | Get current path | `location.pathname` |
| `<Link>` | Navigate via click | `<Link to="/home">` |
| `<Navigate>` | Redirect in route | `<Navigate to="/login" />` |

---

## Router Hooks

```javascript
import { useNavigate, useParams, useLocation } from 'react-router-dom'

// Navigate programmatically
const navigate = useNavigate()
navigate('/dashboard')

// Get URL params
const { courseId } = useParams()

// Get current location
const location = useLocation()
console.log(location.pathname)
```

---

## Understanding createBrowserRouter

**Old Way:**
```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</BrowserRouter>
```

**New Way:**
```javascript
const router = createBrowserRouter([
  { path: '/', element: <Home /> }
])

<RouterProvider router={router} />
```

---

## Debugging

### Check if Token Exists
```javascript
const token = localStorage.getItem('authToken')
console.log('Token:', token)
```

### Check Current Route
```javascript
import { useLocation } from 'react-router-dom'
const { pathname } = useLocation()
console.log('Current path:', pathname)
```

### See All Routes
Open `src/router/router.js` and view the `createBrowserRouter` array.

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Blank page | Check RouterProvider in main.jsx |
| Routes not working | Check router.js file exists and exports |
| Can't access protected route with token | Check localStorage key is `authToken` |
| Infinite redirect loop | Check home route doesn't create loop |
| Link not working | Use `<Link>` from react-router-dom |

---

## Testing Routes

1. **Open app**: http://localhost:5173
2. **Should see**: Login page (redirected from home)
3. **Enter credentials**: Use student email/password
4. **Should see**: Dashboard page
5. **Click course**: Should go to /course/:courseId
6. **Logout**: Should redirect to login
7. **Try accessing /dashboard**: Should redirect to login

---

## Files to Know

- **src/router/router.js** - Where routes are defined
- **src/components/ProtectedRoute.jsx** - Where token checking happens
- **src/main.jsx** - Where RouterProvider is used
- **src/App.jsx** - Now empty (routing moved to router.js)

---

**That's it! Simple and clean. 🎯**
