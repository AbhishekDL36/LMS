# Redux Architecture - Visual Guide

Complete visual explanation of how Redux works in your LMS frontend.

---

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / User                       │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                   main.jsx                              │
│  Renders with <Provider store={store}>                 │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│              Redux Provider                             │
│          (Makes store available)                        │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│              React Router                               │
│    ProtectedRoute wrapper with <useSelector>          │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
   ┌────▼────┐         ┌────▼────┐
   │  Login  │         │Dashboard│
   │Component│         │Component │
   │         │         │          │
   │dispatch │         │useSelector
   │(action) │         │(state)   │
   └────┬────┘         └────┬─────┘
        │                   │
        └─────────┬─────────┘
                  │
        ┌─────────▼──────────┐
        │  Redux Store       │
        │  (Single Source    │
        │   of Truth)        │
        └───────────────────┘
```

---

## 🔄 Redux State Flow

### The Redux Cycle

```
     ┌──────────────────────────────────────┐
     │                                      │
     │  Component Dispatches Action        │
     │  ┌────────────────────────────────┐ │
     │  │ dispatch(loginSuccess(token))  │ │
     │  └────────────────────────────────┘ │
     │                                      │
     └──────────────┬───────────────────────┘
                    │
                    ▼
     ┌──────────────────────────────────────┐
     │                                      │
     │  Reducer Processes Action           │
     │  ┌────────────────────────────────┐ │
     │  │ loginSuccess (state, action) { │ │
     │  │   state.token = action.payload │ │
     │  │   state.isAuth = true          │ │
     │  │ }                              │ │
     │  └────────────────────────────────┘ │
     │                                      │
     └──────────────┬───────────────────────┘
                    │
                    ▼
     ┌──────────────────────────────────────┐
     │                                      │
     │  Store State Updated                │
     │  ┌────────────────────────────────┐ │
     │  │ {                              │ │
     │  │   auth: {                      │ │
     │  │     token: "..."               │ │
     │  │     isAuthenticated: true      │ │
     │  │   }                            │ │
     │  │ }                              │ │
     │  └────────────────────────────────┘ │
     │                                      │
     └──────────────┬───────────────────────┘
                    │
                    ▼
     ┌──────────────────────────────────────┐
     │                                      │
     │  Components with useSelector        │
     │  Notice State Change                │
     │  ┌────────────────────────────────┐ │
     │  │ const isAuth =                 │ │
     │  │   useSelector(state =>         │ │
     │  │     state.auth.isAuth)         │ │
     │  │                                │ │
     │  │ Component Re-renders            │ │
     │  └────────────────────────────────┘ │
     │                                      │
     └──────────────────────────────────────┘
```

---

## 📦 Redux Store Structure

```
Redux Store (Root)
│
└── auth (from authSlice)
    │
    ├── token (string or null)
    │   └── "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    │       or null
    │
    └── isAuthenticated (boolean)
        └── true or false
```

**Tree View:**
```
state.auth.token = "eyJhbGci..." (after login)
state.auth.token = null (before login)

state.auth.isAuthenticated = true (after login)
state.auth.isAuthenticated = false (before login)
```

---

## 🎯 Component Integration

### Login Component Flow

```
┌─────────────────────┐
│   User Submits      │
│   Login Form        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  handleLogin()                      │
│                                     │
│  POST /api/auth/login               │
│  (send email + password)            │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Backend Response                   │
│  { token: "eyJhbGci..." }           │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  dispatch(loginSuccess(token))      │
│                                     │
│  This triggers authSlice reducer    │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  authSlice.loginSuccess reducer:    │
│                                     │
│  state.token = token                │
│  state.isAuthenticated = true       │
│  localStorage.setItem(...)          │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  navigate('/dashboard')             │
│                                     │
│  Change route                       │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  ProtectedRoute checks:             │
│                                     │
│  const isAuth = useSelector(...)    │
│  isAuth = true ✓                    │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  render(<Dashboard />)              │
│                                     │
│  Dashboard component shows          │
└─────────────────────────────────────┘
```

### Logout Component Flow

```
┌──────────────────────┐
│  User Clicks         │
│  Logout Button       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  dispatch(logout())                  │
│                                      │
│  Triggers authSlice reducer          │
└──────────┬─────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  authSlice.logout reducer:           │
│                                      │
│  state.token = null                  │
│  state.isAuthenticated = false       │
│  localStorage.removeItem(...)        │
└──────────┬─────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  navigate('/login')                  │
│                                      │
│  Change route                        │
└──────────┬─────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  ProtectedRoute checks:              │
│                                      │
│  const isAuth = useSelector(...)     │
│  isAuth = false ✗                    │
└──────────┬─────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  <Navigate to="/" />                 │
│                                      │
│  Redirect to login page              │
└──────────────────────────────────────┘
```

---

## 🔌 Redux Hooks Usage

### useSelector - Reading State

```
Component:
┌─────────────────────────────────────┐
│  const isAuth = useSelector(        │
│    (state) => state.auth.isAuth     │
│  )                                  │
└──────────────┬──────────────────────┘
               │
               ▼
         Redux Store
         │
         └── auth.isAuthenticated
             │
             └── return value to component
                 (true or false)
```

### useDispatch - Writing State

```
Component:
┌──────────────────────────────────────┐
│  const dispatch = useDispatch()      │
│                                      │
│  dispatch(loginSuccess(token))       │
└──────────────┬───────────────────────┘
               │
               ▼
           Action Object
           ┌─────────────────────────────┐
           │ {                           │
           │   type: 'auth/loginSuccess',│
           │   payload: token            │
           │ }                           │
           └──────────────┬──────────────┘
                          │
                          ▼
                      Reducer
                      ┌──────────────────┐
                      │ loginSuccess() { │
                      │   state.token =  │
                      │   payload        │
                      │ }                │
                      └──────────────────┘
```

---

## 📊 State Change Example

### Before Login
```
Redux Store State:
{
  auth: {
    token: null,
    isAuthenticated: false
  }
}

localStorage:
authToken: (not set)

ProtectedRoute:
const isAuth = false
→ <Navigate to="/" />

UI:
Login page shown
```

### After Login
```
Redux Store State:
{
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    isAuthenticated: true
  }
}

localStorage:
authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

ProtectedRoute:
const isAuth = true
→ return children

UI:
Dashboard shown
```

---

## 🔗 File Relationships

```
main.jsx
├─ imports Provider from react-redux
├─ imports store from app/store.js
└─ wraps <App /> with Provider

app/store.js
├─ imports configureStore
├─ imports authReducer from authSlice.js
└─ exports configured store

features/auth/authSlice.js
├─ imports createSlice
├─ creates authSlice
├─ exports loginSuccess action
├─ exports logout action
└─ exports reducer

components/ProtectedRoute.jsx
├─ imports useSelector from react-redux
├─ imports Navigate from react-router-dom
└─ reads state.auth.isAuthenticated

pages/Login.jsx
├─ imports useDispatch from react-redux
├─ imports loginSuccess from authSlice
└─ dispatches loginSuccess(token)
```

---

## 🎬 Complete Login Sequence Diagram

```
User                    Browser             Redux Store         Backend
 │                        │                      │                  │
 ├─── Fill Form ─────────>│                      │                  │
 │                        │                      │                  │
 ├─── Click Login ─────────────> POST /auth/login ─────────────────>│
 │                        │                      │                  │
 │                        │                      │                  │
 │                        │                      │         ┌─────────┤
 │                        │                      │         │ Validate
 │                        │                      │         │ Email & PW
 │                        │                      │         └─────────┤
 │                        │                      │                  │
 │                        │<──────────────────────────────token─────┤
 │                        │                      │                  │
 │                        │   dispatch(          │                  │
 │                        │ loginSuccess(token)) │                  │
 │                        │ ────────────────────>│                  │
 │                        │                      │                  │
 │                        │                 state.token = token     │
 │                        │                 state.isAuth = true     │
 │                        │                 localStorage update     │
 │                        │                      │                  │
 │                        │<──────────────────────                  │
 │                        │ useSelector notices                     │
 │                        │ component re-renders                    │
 │                        │ navigate('/dashboard')                  │
 │                        │                      │                  │
 │<─ Redirect to ─────────│                      │                  │
 │  Dashboard             │                      │                  │
 │                        │ ProtectedRoute checks                   │
 │                        │ useSelector → isAuth = true             │
 │                        │ render Dashboard                        │
 │                        │                      │                  │
 │<─ Show Dashboard ──────│                      │                  │
 │                        │                      │                  │
```

---

## 🔐 Security Flow

```
1. No Login
   ├── token = null
   ├── isAuthenticated = false
   ├── ProtectedRoute redirects to /login
   └── Cannot access /dashboard

2. After Login
   ├── token = "eyJhbG..."
   ├── isAuthenticated = true
   ├── ProtectedRoute allows access
   ├── Can access /dashboard
   └── Token in localStorage for persistence

3. After Logout
   ├── token = null
   ├── isAuthenticated = false
   ├── localStorage cleared
   ├── ProtectedRoute redirects to /login
   └── Cannot access /dashboard
```

---

## 💾 Persistence Flow

```
App First Load:
    ↓
1. localStorage has token from previous session
    ↓
2. authSlice reads: localStorage.getItem('authToken')
    ↓
3. initialState.token = token (not null)
    ↓
4. initialState.isAuthenticated = true
    ↓
5. ProtectedRoute sees isAuth = true
    ↓
6. User stays logged in (no re-login needed)


App Logout:
    ↓
1. dispatch(logout())
    ↓
2. reducer clears: state.token = null
    ↓
3. reducer removes: localStorage.removeItem('authToken')
    ↓
4. Next page load: localStorage has no token
    ↓
5. initialState.token = null
    ↓
6. User must login again
```

---

## 🎯 Selector Pattern

```
Direct Selector (Simple):
const token = useSelector((state) => state.auth.token)


Memoized Selector (Prevents unnecessary re-renders):
const selectToken = (state) => state.auth.token
const token = useSelector(selectToken)


Multiple Selectors:
const token = useSelector((state) => state.auth.token)
const isAuth = useSelector((state) => state.auth.isAuthenticated)
// Component re-renders if either changes
```

---

## 📈 Performance

```
Without Redux:
Component
    ├── Prop A passed down
    ├── Prop B passed down
    ├── Prop C passed down
    └── All parents re-render when any change


With Redux + useSelector:
Component
    └── Directly subscribes to relevant state
        └── Only re-renders if that specific state changes
```

---

## 🚀 Future Expansion

```
Current (Auth only):
state.auth
├── token
└── isAuthenticated


Future (Add More Slices):
state.auth
├── token
└── isAuthenticated

state.user
├── name
├── email
└── role

state.courses
├── list
└── loading

state.ui
├── sidebarOpen
└── theme
```

---

**Your Redux architecture is clean and scalable! 🎉**
