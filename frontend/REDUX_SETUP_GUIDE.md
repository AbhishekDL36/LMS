# Redux Toolkit Setup Guide - STEP 9.5

Complete guide to the Redux Toolkit implementation for authentication state management.

---

## 📦 What Was Installed

```bash
npm install @reduxjs/toolkit react-redux
```

**Packages Added:**
- `@reduxjs/toolkit` (v1.9.7) - Simplified Redux setup
- `react-redux` (v8.1.3) - React bindings for Redux

---

## 📁 File Structure

```
src/
├── app/
│   └── store.js                    ⭐ Redux store configuration
│
├── features/
│   └── auth/
│       └── authSlice.js            ⭐ Auth state & reducers
│
├── components/
│   └── ProtectedRoute.jsx          ✏️ UPDATED - uses Redux
│
├── pages/
│   └── Login.jsx                   ✏️ UPDATED - dispatches Redux actions
│
└── main.jsx                        ✏️ UPDATED - wraps with Provider
```

---

## 🎯 Core Concepts

### Redux State Structure

```
Redux Store
└── state
    └── auth (from authSlice)
        ├── token: "eyJhbGci..." or null
        └── isAuthenticated: true or false
```

### Redux Flow

```
Component
    ↓
dispatch(action)
    ↓
Reducer (in slice)
    ↓
Update state
    ↓
Component reads updated state
    ↓
Component re-renders
```

---

## 📝 File Breakdown

### 1. src/app/store.js - Redux Store

**Purpose:** Create and configure the Redux store

```javascript
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,  // Register auth reducer
  },
})

export default store
```

**Key Points:**
- `configureStore` creates the Redux store
- `reducer` object registers all slices
- Each slice is a separate part of state

### 2. src/features/auth/authSlice.js - Auth Logic

**Purpose:** Define auth state, initial values, and actions

```javascript
import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  
  initialState: {
    token: localStorage.getItem('authToken') || null,
    isAuthenticated: !!localStorage.getItem('authToken'),
  },
  
  reducers: {
    // loginSuccess action
    loginSuccess: (state, action) => {
      state.token = action.payload
      state.isAuthenticated = true
      localStorage.setItem('authToken', action.payload)
    },
    
    // logout action
    logout: (state) => {
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('authToken')
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
```

**Key Points:**
- `createSlice` combines reducer + actions
- `name` becomes state key (state.auth)
- `initialState` sets starting values
- `reducers` are action creators
- Actions automatically exported

### 3. src/main.jsx - Provider Setup

**Purpose:** Wrap app with Redux Provider

```javascript
import { Provider } from 'react-redux'
import store from './app/store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
```

**Key Points:**
- Provider makes store available to all components
- Must wrap entire app
- Goes around Router/App

### 4. src/components/ProtectedRoute.jsx - Using Redux

**Purpose:** Read auth state from Redux

```javascript
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  // Read isAuthenticated from Redux state
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  )

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
```

**Key Points:**
- `useSelector` reads from Redux state
- No localStorage access here
- Simpler and more reliable

### 5. src/pages/Login.jsx - Dispatching Actions

**Purpose:** Dispatch Redux actions on login

```javascript
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../features/auth/authSlice'

export default function Login() {
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    // ... API call ...
    
    // Dispatch Redux action
    dispatch(loginSuccess(data.token))
    
    // Redux updates state + localStorage
    // ProtectedRoute will see isAuthenticated = true
    navigate('/dashboard')
  }
}
```

**Key Points:**
- `useDispatch` gets dispatch function
- `dispatch(action)` triggers reducer
- Action receives token as payload
- Reducer updates both state and localStorage

---

## 🔄 Data Flow Example

### User Login Flow

```
1. User fills form and submits
        ↓
2. handleLogin() called
        ↓
3. API call to POST /api/auth/login
        ↓
4. Backend returns { token: "..." }
        ↓
5. dispatch(loginSuccess(token))
        ↓
6. Reducer runs:
   - state.token = token
   - state.isAuthenticated = true
   - localStorage.setItem('authToken', token)
        ↓
7. Component re-renders (sees new state)
        ↓
8. navigate('/dashboard')
        ↓
9. ProtectedRoute checks useSelector
   - reads state.auth.isAuthenticated
   - isAuthenticated = true
        ↓
10. Dashboard renders
```

### User Logout Flow

```
1. User clicks logout button
        ↓
2. dispatch(logout())
        ↓
3. Reducer runs:
   - state.token = null
   - state.isAuthenticated = false
   - localStorage.removeItem('authToken')
        ↓
4. Component re-renders
        ↓
5. navigate('/login')
        ↓
6. ProtectedRoute checks useSelector
   - reads state.auth.isAuthenticated
   - isAuthenticated = false
        ↓
7. Navigate to "/" → then to "/login"
        ↓
8. Login page renders
```

---

## 🎣 Redux Hooks

### useSelector - Read State

```javascript
import { useSelector } from 'react-redux'

// In component:
const isAuthenticated = useSelector(
  (state) => state.auth.isAuthenticated
)
const token = useSelector((state) => state.auth.token)
```

**Used For:**
- Reading Redux state in components
- Triggers re-render when state changes
- Simple selector function

### useDispatch - Update State

```javascript
import { useDispatch } from 'react-redux'
import { loginSuccess, logout } from './authSlice'

// In component:
const dispatch = useDispatch()

// Trigger action:
dispatch(loginSuccess(token))
dispatch(logout())
```

**Used For:**
- Dispatching actions to update state
- No re-render from dispatch itself
- State changes trigger re-renders

---

## 📊 State Example

### Initial State (No Login)
```javascript
{
  auth: {
    token: null,
    isAuthenticated: false
  }
}
```

### After Successful Login
```javascript
{
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    isAuthenticated: true
  }
}
```

### After Logout
```javascript
{
  auth: {
    token: null,
    isAuthenticated: false
  }
}
```

---

## 🔗 Integration with Existing Code

### ProtectedRoute Now Uses Redux
```
OLD: localStorage.getItem('authToken')
NEW: useSelector(state => state.auth.isAuthenticated)
```

### Login Now Uses Redux
```
OLD: localStorage.setItem('authToken', token)
NEW: dispatch(loginSuccess(token))
```

### App Wrapped with Provider
```
Provider
  └── Router
      └── Routes
          └── Components
```

---

## 📚 How to Use in Your Components

### Reading Auth State

```javascript
import { useSelector } from 'react-redux'

export default function Dashboard() {
  const token = useSelector((state) => state.auth.token)
  const isAuth = useSelector((state) => state.auth.isAuthenticated)
  
  return (
    <div>
      {isAuth ? 'Logged in' : 'Not logged in'}
    </div>
  )
}
```

### Dispatching Actions

```javascript
import { useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'

export default function Dashboard() {
  const dispatch = useDispatch()
  
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }
  
  return <button onClick={handleLogout}>Logout</button>
}
```

---

## 🧪 Testing Redux Flow

### Step 1: Check Redux DevTools (in Browser)
```
1. Install Redux DevTools Extension (browser extension)
2. Open DevTools → Redux tab
3. See all state changes
4. See all dispatched actions
```

### Step 2: Console Logging
```javascript
const state = useSelector((state) => state.auth)
console.log('Auth state:', state)
```

### Step 3: Check localStorage
```javascript
// In DevTools Console:
localStorage.getItem('authToken')
```

---

## 🐛 Common Patterns

### Get Token for API Calls

**Old Way:**
```javascript
const token = localStorage.getItem('authToken')
```

**New Way (Redux):**
```javascript
const token = useSelector((state) => state.auth.token)
```

### Check If Authenticated

**Old Way:**
```javascript
if (localStorage.getItem('authToken')) {
  // user is logged in
}
```

**New Way (Redux):**
```javascript
const isAuth = useSelector((state) => state.auth.isAuthenticated)
if (isAuth) {
  // user is logged in
}
```

### Handle Logout

**Old Way:**
```javascript
localStorage.removeItem('authToken')
navigate('/login')
```

**New Way (Redux):**
```javascript
dispatch(logout())  // Clears token and localStorage
navigate('/login')
```

---

## ✅ Benefits of Redux

1. **Centralized State** - All auth state in one place
2. **Predictable** - Same input → same output
3. **Easy to Debug** - See all state changes
4. **Easy to Test** - Pure functions
5. **Scalable** - Easy to add new slices later
6. **Type Safe** - Works well with TypeScript
7. **Performance** - Only re-renders when relevant state changes

---

## 📈 Next Steps

### Future Enhancements (Not Done Yet)

1. **Async Thunks** - Handle API calls in Redux
   ```javascript
   const loginUser = createAsyncThunk(...)
   ```

2. **User Slice** - Store user info
   ```javascript
   // state.user.name, state.user.email
   ```

3. **Loading State** - Track API loading
   ```javascript
   // state.auth.loading = true/false
   ```

4. **Error Handling** - Store API errors
   ```javascript
   // state.auth.error = null or error message
   ```

5. **Persistent State** - Recover state after refresh
   ```javascript
   // Already working! Token from localStorage
   ```

---

## 🚀 Summary

**Redux Toolkit simplifies Redux by:**
- ✅ Removing boilerplate code
- ✅ Combining actions + reducers
- ✅ Handling mutations safely
- ✅ Setting up store automatically

**Your setup includes:**
- ✅ Store configuration
- ✅ Auth slice with actions
- ✅ Provider wrapper
- ✅ Components using Redux
- ✅ Persistent state (localStorage)

**Ready for:**
- ✅ Login/Logout
- ✅ Protected routes
- ✅ Auth state in components
- ✅ Future expansions

---

**Your Redux Toolkit setup is complete and ready to use! 🎉**
