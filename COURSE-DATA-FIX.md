# Course Data Issue - Fix Required

## Problem
- Courses show "Unknown Teacher" - old courses don't have teacherId
- Courses show "Created: N/A" - old courses don't have createdAt field

## Root Cause
Old courses in the database were created before the schema update:
1. Course model was missing `createdAt` and `updatedAt` fields
2. Old courses have empty/null teacherId

## Solution

### Updated Course Schema (backend/models/Course.js)
Added:
```javascript
// Timestamps
createdAt: {
  type: Date,
  default: Date.now,
},

updatedAt: {
  type: Date,
  default: Date.now,
},

// Made teacherId required
teacherId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,  // Now required
},
```

### Required Steps

#### Option 1: Clear Database (Recommended for Development)
1. Go to MongoDB Atlas or your MongoDB dashboard
2. Delete all documents in the `courses` collection
3. Delete all documents in the `enrollments` collection (they reference courses)
4. Teachers can create courses again - they'll have proper createdAt and teacherId

#### Option 2: Manual Migration (If keeping data)
```javascript
// Run this in MongoDB console
db.courses.updateMany(
  { teacherId: null },
  { 
    $set: { 
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
);
```

**Note**: This won't fix "Unknown Teacher" - you still need to set proper teacherId values.

## After Fix
✅ All new courses will have:
- Proper teacherId (set to the teacher who created it)
- createdAt timestamp
- updatedAt timestamp

✅ Admin courses page will show:
- Teacher name (instead of "Unknown Teacher")
- Proper created date (instead of "N/A")

## Steps to Test

1. **Clear courses from MongoDB**:
   - MongoDB Atlas → Collections → courses → Delete all documents
   - Also clear enrollments collection

2. **Restart backend**:
   ```bash
   npm run dev
   ```

3. **Create a new course as teacher**:
   - Login as teacher
   - Click "Create Course"
   - Fill in title and description
   - Submit

4. **Check Admin Courses**:
   - Login as admin
   - Go to Admin Dashboard → All Courses
   - New course should show:
     - Correct teacher name
     - Correct created date

## Files Updated
- `backend/models/Course.js` - Added timestamps and required teacherId
