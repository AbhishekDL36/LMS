# Assignment Grades Display Feature

## Overview
Modified the Assignment page to show grades and teacher feedback for submitted assignments instead of the submission form.

## Changes Made

### File: `frontend/src/pages/Assignment.jsx`

#### 1. New State Variables
```javascript
const [studentSubmission, setStudentSubmission] = useState(null);
const [submissionLoading, setSubmissionLoading] = useState(false);
```

#### 2. Enhanced handleSelectAssignment Function
Now fetches the student's submission status when an assignment is selected:
```javascript
const handleSelectAssignment = async (assignment) => {
  // ... existing code ...
  
  // NEW: Fetch student's submission
  setSubmissionLoading(true);
  try {
    const response = await fetch(
      `http://localhost:5000/api/assignment/${assignment._id}/my-submission`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setStudentSubmission(data.submission);
    } else {
      setStudentSubmission(null); // Not submitted yet
    }
  } catch (err) {
    console.error("Error fetching submission:", err);
    setStudentSubmission(null);
  } finally {
    setSubmissionLoading(false);
  }
};
```

#### 3. New UI States

**Loading State**:
- Shows spinner while fetching submission status

**Graded (status = "checked")**:
- Display large green card with "✓ Assignment Graded"
- Show marks prominently (large number)
- Show grading date
- Display teacher's feedback (if provided)
- Show student's submitted answer for reference

**Pending (status = "submitted")**:
- Display blue card with "⏳ Pending Review"
- Show submission date
- Indicate waiting for teacher to grade
- Show student's submitted answer

**Not Submitted**:
- Show submission form as before
- Allow student to type and submit answer

## User Flow

```
Student clicks assignment
    ↓
Fetches submission status via /api/assignment/{id}/my-submission
    ↓
If No Submission:
    → Show submission form
    
If Submitted & Graded:
    → Show green card with marks
    → Show teacher feedback
    → Show student's answer
    
If Submitted & Pending:
    → Show blue card with pending status
    → Show student's answer
    → Waiting message
```

## API Endpoint Used

**GET** `/api/assignment/{assignmentId}/my-submission`
- Requires: Authorization header with Bearer token
- Returns: `{ submission: { marks, feedback, status, answerText, submittedAt, gradedAt } }`

**Response Status**:
- `200`: Submission found
- `404`: No submission found (student hasn't submitted)

## UI Components

### Graded Card
- Green background (green-50)
- Green border (border-green-200)
- Shows marks in large font
- Displays grading date
- Shows feedback in white box with border
- Includes student's original answer

### Pending Card
- Blue background (blue-50)
- Blue border (border-blue-200)
- Shows submission date
- "⏳ Pending Review" message
- Includes student's original answer

### Answer Display
- Gray background (gray-50)
- Shows full submitted text with formatting preserved
- Labeled "Your Submission"
- Always visible for submitted assignments

## Data Structure (from Backend)

```javascript
{
  _id: "ObjectId",
  marks: 85,                    // Grade given by teacher
  feedback: "Good work...",    // Teacher's comments
  status: "checked",           // "submitted" or "checked"
  answerText: "My answer...",  // Student's submitted text
  submittedAt: "2026-02-16...", // When submitted
  gradedAt: "2026-02-17...",   // When graded (if graded)
  assignmentId: "ObjectId"
}
```

## Key Features

✅ **Smart Display**: Shows different UI based on submission status
✅ **Async Loading**: Fetches submission data when assignment selected
✅ **Marks Display**: Prominent display of grades
✅ **Feedback Show**: Teacher's feedback displayed clearly
✅ **Answer Reference**: Student can see their submitted answer
✅ **Pending State**: Clear indication if still waiting for grading
✅ **Responsive**: Works on all screen sizes
✅ **Error Handling**: Gracefully handles missing submissions

## Testing Scenarios

### Scenario 1: Not Submitted
1. Login as student
2. Click assignment in list
3. Expected: See submission form

### Scenario 2: Submitted, Not Graded
1. Student submits assignment
2. Click same assignment
3. Expected: See "Pending Review" card with submission date
4. Expected: Cannot resubmit (form hidden)

### Scenario 3: Submitted & Graded
1. Teacher grades the submission
2. Student clicks assignment
3. Expected: See green "Assignment Graded" card
4. Expected: See marks, grading date, feedback
5. Expected: See their original answer at bottom
6. Expected: Cannot resubmit (form hidden)

## Notes

- Multiple submissions per assignment are prevented by backend
- Once submitted, student can view their answer and grade
- Teacher feedback is optional (may be null)
- Grading date is set when teacher evaluates
- All dates are formatted to user's locale
