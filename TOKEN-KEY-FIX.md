# Token Storage Key Fix

## Problem
The app was saving tokens as 'token' (in authSlice) but some pages were reading them as 'authToken', causing authentication to fail.

## Root Cause
Two different localStorage keys:
- authSlice.js saves: `localStorage.setItem('token', ...)`
- auth.js and old pages read: `localStorage.getItem('authToken')`
- Result: API calls had no token, backend rejected with 403

## Solution
Unified all token operations to use 'token' key.

## Files Fixed

### 1. frontend/src/utils/api.js (NEW)
Created centralized API utility for all API calls with automatic token injection

```javascript
export const apiGet = (endpoint) => apiCall(endpoint, { method: 'GET' })
export const apiPost = (endpoint, data) => apiCall(endpoint, { method: 'POST', body: ... })
```

All API calls now go through this utility which:
- Reads token from localStorage.getItem('token')
- Adds Authorization header automatically
- Throws error if token missing

### 2. frontend/src/utils/auth.js (UPDATED)
Changed from 'authToken' to 'token':

```javascript
const getToken = () => localStorage.getItem('token');  // was 'authToken'
```

### 3. frontend/src/pages/Dashboard.jsx (UPDATED)
- Now uses: `import { apiGet } from '../utils/api'`
- API calls use: `await apiGet('/course/enrolled')`
- Removed manual token handling

### 4. frontend/src/pages/StudentDashboard.jsx (UPDATED)
- Now uses: `import { apiGet } from '../utils/api'`
- API calls use: `await apiGet('/dashboard/student')`
- Was using `localStorage.getItem('authToken')` - FIXED

### 5. frontend/src/pages/TeacherDashboard.jsx (UPDATED)
- Now uses: `import { apiGet } from '../utils/api'`
- API calls use: `await apiGet('/dashboard/teacher')`
- Was using `localStorage.getItem('authToken')` - FIXED

### 6. frontend/src/features/auth/authSlice.js (VERIFIED)
Uses correct key everywhere:
- `localStorage.setItem('token', action.payload)`
- `localStorage.getItem('token')`
- `localStorage.removeItem('token')`

## How It Works Now

1. User logs in
2. authSlice stores: `localStorage.setItem('token', jwtToken)`
3. Any API call uses apiGet/apiPost/etc
4. API utility reads: `localStorage.getItem('token')`
5. API utility adds header: `Authorization: Bearer <token>`
6. Backend receives token, extracts role, allows access

## Test Steps

1. Login as student
2. Navigate to "My Courses"
3. Should see enrolled courses (not "Access denied")
4. Check browser Network tab
5. API request should have: `Authorization: Bearer eyJ...`
6. Should NOT see 403 error

## All API Calls Must Use

```javascript
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

// Instead of:
fetch('http://localhost:5000/api/...', {
  headers: { 'Authorization': `Bearer ${token}` }
})

// Use:
apiGet('/endpoint')
apiPost('/endpoint', data)
apiPut('/endpoint', data)
apiDelete('/endpoint')
```

## Key Files Using New API Utility
- Dashboard.jsx ✅
- StudentDashboard.jsx ✅
- TeacherDashboard.jsx ✅

## Remaining Pages to Update
Other pages may still use old manual token approach - monitor for 403 errors and update them similarly
