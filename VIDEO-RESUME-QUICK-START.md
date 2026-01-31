# Video Resume Feature - Quick Start Guide

## What Was Added
Students can now **resume watching lectures from where they paused**, just like YouTube or Udemy.

## How to Use

### For Students
1. **Watch a lecture** → Pause at any point
2. **Refresh the page** or come back later
3. **Video resumes** from exact same second ✅

### Example
```
Watch lecture → Pause at 2:30
    ↓
Refresh page
    ↓
Video plays from 2:30 automatically
```

## Technical Implementation

### File Modified
`frontend/src/pages/CourseDetail.jsx`

### Three New Functions

#### 1. `fetchLastWatchTime(lectureId)` - Lines 33-65
- Fetches saved watch time from backend
- Uses GET `/api/watch-time/lecture/{lectureId}`
- Returns saved time in seconds

#### 2. `handleVideoLoadedMetadata()` - Lines 71-90
- Applies saved time to video element
- Only runs AFTER video metadata loads (crucial!)
- Sets `videoRef.current.currentTime = savedTime`

#### 3. `useEffect` Hook - Lines 97-109
- Listens for when lecture changes
- Adds 'loadedmetadata' event listener
- Triggers resume logic when video is ready

### How It Works

```javascript
// When lecture is selected:
useEffect(() => {
  // 1. Add listener for when video metadata loads
  videoElement.addEventListener('loadedmetadata', handleVideoLoadedMetadata)
  
  // When metadata loads:
  // 2. Fetch saved watch time from backend
  const savedTime = await fetchLastWatchTime(lectureId)
  
  // 3. Apply to video
  if (savedTime > 0) {
    videoRef.current.currentTime = savedTime
  }
}, [selectedLecture])
```

## Flow Diagram

```
┌─────────────┐
│ User pauses │
└──────┬──────┘
       ↓
┌──────────────────────────┐
│ handleVideoPause() fires │
│ Save time to backend ✅  │
└──────┬───────────────────┘
       ↓
┌─────────────────────┐
│ Page refreshed or   │
│ lecture reloaded    │
└──────┬──────────────┘
       ↓
┌──────────────────────────┐
│ Video element loads      │
│ 'loadedmetadata' fires   │
└──────┬───────────────────┘
       ↓
┌──────────────────────────┐
│ Fetch saved time from    │
│ backend API              │
└──────┬───────────────────┘
       ↓
┌──────────────────────────┐
│ Apply time to video      │
│ currentTime = savedTime  │
└──────┬───────────────────┘
       ↓
┌──────────────────────┐
│ Video resumes from   │
│ saved point ✅       │
└──────────────────────┘
```

## Key Points

### Why Wait for 'loadedmetadata'?
❌ Setting `currentTime` before video loads = does nothing
✅ Setting after 'loadedmetadata' = works perfectly

### Why Async Fetch?
- Each lecture has different saved times
- Must fetch from backend when lecture changes
- Async prevents blocking video playback

### Why Separate Function?
- Cleaner code organization
- Easy to test
- Reusable logic

## Testing Your Code

### Test 1: Basic Resume
```
1. Play lecture, pause at 1:30
2. Refresh page (F5)
3. Video should resume from ~1:30
✅ Should work
```

### Test 2: Multiple Lectures
```
1. Lecture A: pause at 2:00
2. Switch to Lecture B: pause at 3:30
3. Switch back to Lecture A
4. Should resume from 2:00
✅ Should work
```

### Test 3: Browser Console
Open Developer Tools (F12) → Console
Should see:
```
"Video resumed from 225 seconds"
"Watch time saved: 225"
```

## What Still Works (No Changes)

✅ Save watch time on pause (existing `handleVideoPause`)
✅ Video controls (play, pause, seek)
✅ Multiple lectures in sidebar
✅ Navigation to quizzes and assignments
✅ All other course features

## API Endpoints Used

### Get Saved Watch Time
```
GET /api/watch-time/lecture/{lectureId}
Headers: Authorization: Bearer {token}
Response: { currentTime: 225 }
```

### Save Watch Time
```
POST /api/watch-time/save
Headers: Authorization: Bearer {token}
Body: { lectureId, currentTime: 225 }
Response: { success: true }
```

Both endpoints already exist - no backend changes needed!

## Common Issues

### "Video not resuming"
**Cause:** Backend not returning saved time
**Solution:** Check browser console for errors

### "Video starts at 0:00"
**Cause:** First time watching lecture (no saved time)
**Solution:** Normal behavior! Save time only exists after first pause

### "Time is wrong"
**Cause:** Rounding difference (stored as integer)
**Solution:** Normal - difference of 1-2 seconds is expected

## Code Location Reference

**File:** `frontend/src/pages/CourseDetail.jsx`

| Feature | Lines | Purpose |
|---------|-------|---------|
| Fetch function | 33-65 | Get saved time from API |
| Apply handler | 71-90 | Apply time to video |
| useEffect hook | 97-109 | Wire everything together |
| Video element | 200-215 | Still has `onPause={handleVideoPause}` |

## Production Checklist

- [x] Code implemented
- [x] Uses existing API routes
- [x] No backend changes needed
- [x] Proper error handling
- [x] Memory cleanup (removeEventListener)
- [x] Async/await for timing
- [x] Comments for clarity
- [x] Matches code style
- [x] No breaking changes
- [x] Beginner-friendly logic

---

**Status:** ✅ READY TO USE

Video resume is now working like Udemy/YouTube!
