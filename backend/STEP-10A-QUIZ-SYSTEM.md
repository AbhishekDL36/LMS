# STEP 10A: Quiz/Test System Backend - Documentation

Complete guide to the Quiz/Test system implementation for your LMS backend.

---

## 📦 What Was Implemented

### Models Created (3 files)

1. **models/Test.js**
   - Stores quiz metadata
   - Fields: title, courseId, createdBy, createdAt

2. **models/Question.js**
   - Stores quiz questions
   - Fields: testId, questionText, options, correctAnswer, createdAt

3. **models/TestResult.js**
   - Stores student results and scores
   - Fields: testId, studentId, score, answers, submittedAt

### Routes Created (1 file)

**routes/test.js**
- POST /create - Create new test (teacher only)
- POST /question - Add question to test (teacher only)
- GET /:testId - Get test with questions (student)
- POST /submit - Submit answers and get score (student)

### Updated Files

**server.js**
- Added test routes import
- Registered test routes at `/api/test`

---

## 🎯 Models Overview

### Test Model (models/Test.js)

```javascript
{
  _id: ObjectId,
  title: "Biology Quiz 1",
  courseId: ObjectId,           // References Course
  createdBy: ObjectId,          // Teacher ID (References User)
  createdAt: Date
}
```

**Usage:** Stores basic test information
**Created by:** Teachers
**Used by:** Students (to view available tests)

### Question Model (models/Question.js)

```javascript
{
  _id: ObjectId,
  testId: ObjectId,             // References Test
  questionText: "What is photosynthesis?",
  options: [
    "Process of making food",
    "Process of breathing",
    "Process of digestion",
    "Process of fermentation"
  ],
  correctAnswer: "Process of making food",
  createdAt: Date
}
```

**Usage:** Stores individual quiz questions
**Created by:** Teachers
**Used by:** Students (to answer questions)

### TestResult Model (models/TestResult.js)

```javascript
{
  _id: ObjectId,
  testId: ObjectId,             // References Test
  studentId: ObjectId,          // References User
  score: 85,                    // Out of 100
  answers: [
    {
      questionId: ObjectId,
      selectedAnswer: "Process of making food",
      isCorrect: true
    },
    {
      questionId: ObjectId,
      selectedAnswer: "Wrong answer",
      isCorrect: false
    }
  ],
  submittedAt: Date
}
```

**Usage:** Stores student's quiz attempt and score
**Created by:** Automatic (when student submits)
**Used by:** Students (to view results), Teachers (to grade)

---

## 🛣️ Routes Reference

### 1. Create Test (Teacher Only)

**Endpoint:** `POST /api/test/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Biology Quiz 1",
  "courseId": "6507c1d4e1b2a3f4c5d6e7f8"
}
```

**Response (Success - 201):**
```json
{
  "message": "Test created successfully",
  "testId": "6507c1d4e1b2a3f4c5d6e7f9"
}
```

**Response (Error - 400):**
```json
{
  "message": "Title is required"
}
```

**Requirements:**
- Only teachers can create tests
- Title is required
- Course ID is required
- Course must exist

---

### 2. Add Question (Teacher Only)

**Endpoint:** `POST /api/test/question`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "testId": "6507c1d4e1b2a3f4c5d6e7f9",
  "questionText": "What is photosynthesis?",
  "options": [
    "Process of making food",
    "Process of breathing",
    "Process of digestion",
    "Process of fermentation"
  ],
  "correctAnswer": "Process of making food"
}
```

**Response (Success - 201):**
```json
{
  "message": "Question added successfully",
  "questionId": "6507c1d4e1b2a3f4c5d6e7fa"
}
```

**Response (Error - 400):**
```json
{
  "message": "Correct answer must be one of the options"
}
```

**Requirements:**
- Only teachers can add questions
- Test must exist
- Question text is required
- Options must be an array
- Correct answer must be one of the options

---

### 3. Get Test (Student Can View)

**Endpoint:** `GET /api/test/:testId`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
testId = "6507c1d4e1b2a3f4c5d6e7f9"
```

**Response (Success - 200):**
```json
{
  "test": {
    "_id": "6507c1d4e1b2a3f4c5d6e7f9",
    "title": "Biology Quiz 1",
    "courseId": "6507c1d4e1b2a3f4c5d6e7f8"
  },
  "questions": [
    {
      "_id": "6507c1d4e1b2a3f4c5d6e7fa",
      "testId": "6507c1d4e1b2a3f4c5d6e7f9",
      "questionText": "What is photosynthesis?",
      "options": [
        "Process of making food",
        "Process of breathing",
        "Process of digestion",
        "Process of fermentation"
      ]
    }
  ],
  "totalQuestions": 1
}
```

**Important:**
- Correct answers are NOT returned (correctAnswer field is hidden)
- This is for security (prevents cheating)
- Students only get question text and options

---

### 4. Submit Test (Student Submits Answers)

**Endpoint:** `POST /api/test/submit`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "testId": "6507c1d4e1b2a3f4c5d6e7f9",
  "answers": [
    {
      "questionId": "6507c1d4e1b2a3f4c5d6e7fa",
      "selectedAnswer": "Process of making food"
    },
    {
      "questionId": "6507c1d4e1b2a3f4c5d6e7fb",
      "selectedAnswer": "Option B"
    }
  ]
}
```

**Response (Success - 200):**
```json
{
  "message": "Test submitted successfully",
  "testResult": {
    "_id": "6507c1d4e1b2a3f4c5d6e7fc",
    "score": 75,
    "correctAnswers": 3,
    "totalQuestions": 4
  },
  "answers": [
    {
      "questionId": "6507c1d4e1b2a3f4c5d6e7fa",
      "selectedAnswer": "Process of making food",
      "isCorrect": true
    },
    {
      "questionId": "6507c1d4e1b2a3f4c5d6e7fb",
      "selectedAnswer": "Option B",
      "isCorrect": false
    }
  ]
}
```

**What Happens:**
1. Student sends answers
2. Backend checks each answer against correct answer
3. Calculates score as percentage
4. Saves result to database
5. Returns score and detailed results

---

## 🔐 Security Features

### Teacher-Only Routes
```javascript
router.post('/create', authMiddleware, roleMiddleware('teacher'), ...)
router.post('/question', authMiddleware, roleMiddleware('teacher'), ...)
```

**Protection:**
- Only users with role 'teacher' can create tests
- Only teachers can add questions
- Verified by middleware

### Student Routes
```javascript
router.get('/:testId', authMiddleware, ...)
router.post('/submit', authMiddleware, ...)
```

**Protection:**
- Authenticated users can take tests
- Correct answers hidden from students
- Results saved with student ID

### Data Protection
- Correct answers not sent to frontend (on GET /testId)
- Used only for grading (on POST /submit)
- Answer validation happens on backend

---

## 💻 API Usage Examples

### Using Postman

#### 1. Create Test (as teacher)
```
POST http://localhost:5000/api/test/create
Headers:
  - Authorization: Bearer [teacher_token]
  - Content-Type: application/json
Body:
  {
    "title": "Math Quiz 1",
    "courseId": "6507c1d4e1b2a3f4c5d6e7f8"
  }
```

#### 2. Add Question (as teacher)
```
POST http://localhost:5000/api/test/question
Headers:
  - Authorization: Bearer [teacher_token]
  - Content-Type: application/json
Body:
  {
    "testId": "[test_id_from_step_1]",
    "questionText": "2 + 2 = ?",
    "options": ["2", "3", "4", "5"],
    "correctAnswer": "4"
  }
```

#### 3. Get Test (as student)
```
GET http://localhost:5000/api/test/[test_id]
Headers:
  - Authorization: Bearer [student_token]
```

#### 4. Submit Test (as student)
```
POST http://localhost:5000/api/test/submit
Headers:
  - Authorization: Bearer [student_token]
  - Content-Type: application/json
Body:
  {
    "testId": "[test_id]",
    "answers": [
      {
        "questionId": "[question_id]",
        "selectedAnswer": "4"
      }
    ]
  }
```

---

## 🗂️ File Structure

```
backend/
├── models/
│   ├── Test.js ⭐ NEW
│   ├── Question.js ⭐ NEW
│   ├── TestResult.js ⭐ NEW
│   ├── User.js
│   ├── Course.js
│   └── ... (others)
│
├── routes/
│   ├── test.js ⭐ NEW
│   ├── auth.js
│   ├── course.js
│   └── ... (others)
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── server.js ✏️ UPDATED
└── ... (config, etc)
```

---

## 🔄 Complete Flow Example

### Teacher Creates and Adds Questions

```
1. Teacher logged in with token
2. POST /api/test/create
   - title: "Biology Quiz"
   - courseId: "..."
   → Response: testId = "123"

3. POST /api/test/question
   - testId: "123"
   - questionText: "..."
   - options: [...]
   - correctAnswer: "..."
   → Question added

4. Repeat step 3 for each question
```

### Student Takes Quiz

```
1. Student logged in with token
2. GET /api/test/123
   - Returns test and questions
   - No correct answers shown

3. Student answers questions in frontend
4. POST /api/test/submit
   - testId: "123"
   - answers: [{questionId, selectedAnswer}, ...]
   → Response: score, results

5. Frontend shows score and results
```

---

## 📝 Code Structure

### Test Creation Logic
```javascript
// 1. Validate inputs
// 2. Create Test document
// 3. Save to database
// 4. Return testId
```

### Question Addition Logic
```javascript
// 1. Validate inputs
// 2. Check test exists
// 3. Verify correct answer is valid
// 4. Create Question document
// 5. Save to database
```

### Test Retrieval Logic
```javascript
// 1. Find test by ID
// 2. Find all questions for test
// 3. Hide correct answers (use projection)
// 4. Return test and questions
```

### Test Submission Logic
```javascript
// 1. Get test and all questions
// 2. Create answer map for validation
// 3. Check each student answer
// 4. Calculate score percentage
// 5. Save result to TestResult
// 6. Return score and details
```

---

## 🧪 Testing the Routes

### Test 1: Create Test (Teacher)
```bash
# As a logged-in teacher, create a test
curl -X POST http://localhost:5000/api/test/create \
  -H "Authorization: Bearer [teacher_token]" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test 1","courseId":"..."}'
```

### Test 2: Add Question (Teacher)
```bash
# Add a question to the test
curl -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer [teacher_token]" \
  -H "Content-Type: application/json" \
  -d '{"testId":"...","questionText":"...","options":[...],"correctAnswer":"..."}'
```

### Test 3: Get Test (Student)
```bash
# Student views the test
curl -X GET http://localhost:5000/api/test/[testId] \
  -H "Authorization: Bearer [student_token]"
```

### Test 4: Submit Test (Student)
```bash
# Student submits answers
curl -X POST http://localhost:5000/api/test/submit \
  -H "Authorization: Bearer [student_token]" \
  -H "Content-Type: application/json" \
  -d '{"testId":"...","answers":[...]}'
```

---

## ✅ Features Included

- ✅ Create tests (teacher only)
- ✅ Add multiple choice questions
- ✅ Students take tests
- ✅ Automatic grading
- ✅ Score calculation
- ✅ Answer tracking
- ✅ Security (correct answers hidden)
- ✅ Role-based access control
- ✅ Clear comments for learning

---

## 🚀 Future Enhancements

### Not Implemented (Optional)

1. **Question Types**
   - Multiple choice (done)
   - True/False
   - Short answer
   - Matching

2. **Test Features**
   - Time limit
   - Question randomization
   - Passing score requirement
   - Test retake limit

3. **Analytics**
   - Class average score
   - Question difficulty analysis
   - Student performance tracking

4. **UI Features**
   - Question navigation
   - Answer review
   - Test preview

---

## 📚 Integration with Frontend

### Frontend Will Need

1. **Create Test Component (Teacher)**
   - Form to create test
   - Call POST /api/test/create

2. **Add Question Component (Teacher)**
   - Form to add questions
   - Call POST /api/test/question

3. **Take Test Component (Student)**
   - Display questions
   - Form to submit answers
   - Call GET /api/test/testId
   - Call POST /api/test/submit

4. **Results Component (Student)**
   - Show score
   - Show correct/incorrect answers
   - Allow retake

### Redux Integration

```javascript
// slices/testSlice.js
{
  tests: [],
  currentTest: null,
  questions: [],
  result: null
}

// actions
createTest()
addQuestion()
getTest()
submitTest()
```

---

## 🎓 Learning Resources

**Key Concepts Used:**
- MongoDB models and schema
- Express routes and middleware
- Role-based access control
- Authentication and authorization
- Data validation
- Error handling
- Response formatting

**Best Practices:**
- Input validation
- Error handling
- Comments for clarity
- Modular code structure
- Security considerations

---

## 🎯 Status

```
Models         ✅ Created (3 files)
Routes         ✅ Implemented (4 endpoints)
Security       ✅ Role-based access
Integration    ✅ Added to server.js
Documentation  ✅ Complete
Testing        ⏳ Ready for Postman testing
```

---

**Your Quiz/Test system backend is complete and ready for frontend integration! 🚀**
