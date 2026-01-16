# Redux Toolkit Quick Reference

## Installation
```bash
npm install @reduxjs/toolkit react-redux
```

---

## File Structure
```
src/
├── app/store.js                 ← Configure store
├── features/auth/authSlice.js   ← Define state & actions
├── main.jsx                     ← Wrap with Provider
└── components/ProtectedRoute.jsx ← Use Redux state
```

---

## Key Files

### 1. app/store.js
```javascript
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

const store = configureStore({
  reducer: { auth: authReducer }
})

export default store
```

### 2. features/auth/authSlice.js
```javascript
import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('authToken') || null,
    isAuthenticated: !!localStorage.getItem('authToken'),
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload
      state.isAuthenticated = true
      localStorage.setItem('authToken', action.payload)
    },
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

### 3. main.jsx
```javascript
import { Provider } from 'react-redux'
import store from './app/store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

---

## Redux Hooks

### Read State
```javascript
import { useSelector } from 'react-redux'

const isAuth = useSelector(state => state.auth.isAuthenticated)
const token = useSelector(state => state.auth.token)
```

### Dispatch Actions
```javascript
import { useDispatch } from 'react-redux'
import { loginSuccess, logout } from '../features/auth/authSlice'

const dispatch = useDispatch()

dispatch(loginSuccess(token))
dispatch(logout())
```

---

## State Structure
```javascript
state = {
  auth: {
    token: null or "eyJhbGci...",
    isAuthenticated: true or false
  }
}
```

---

## Common Usage

### ProtectedRoute.jsx
```javascript
const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

if (!isAuthenticated) {
  return <Navigate to="/" />
}

return children
```

### Login.jsx
```javascript
const dispatch = useDispatch()

const handleLogin = async () => {
  const response = await api.post('/auth/login', {...})
  dispatch(loginSuccess(response.data.token))
  navigate('/dashboard')
}
```

### Logout Handler
```javascript
const dispatch = useDispatch()

const handleLogout = () => {
  dispatch(logout())
  navigate('/login')
}
```

---

## Terminology

| Term | Meaning |
|------|---------|
| **Store** | Central location for all state |
| **Slice** | A piece of state (e.g., auth, user) |
| **Action** | Event that causes state change |
| **Reducer** | Function that updates state |
| **Dispatch** | Trigger an action |
| **useSelector** | Read state in component |
| **useDispatch** | Access dispatch in component |

---

## Data Flow
```
User Action
    ↓
dispatch(action)
    ↓
Reducer updates state
    ↓
useSelector notices change
    ↓
Component re-renders
```

---

## Before vs After

### localStorage (Old)
```javascript
// Saving
localStorage.setItem('authToken', token)

// Reading
const token = localStorage.getItem('authToken')
```

### Redux (New)
```javascript
// Saving
dispatch(loginSuccess(token))  // Redux + localStorage

// Reading
const token = useSelector(state => state.auth.token)
```

---

## DevTools

### Check Redux State
1. Install Redux DevTools Extension
2. Open DevTools → Redux tab
3. See all state changes and actions

### Console Logging
```javascript
const auth = useSelector(state => state.auth)
console.log('Auth:', auth)
```

---

## Next Steps (Future)

- [ ] Add async thunks for API calls
- [ ] Add user slice for profile
- [ ] Add loading/error states
- [ ] Add more slices as needed

---

**Redux Toolkit makes state management simple! 🎉**
