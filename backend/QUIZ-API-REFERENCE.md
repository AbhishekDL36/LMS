# Quiz/Test API Quick Reference

Fast lookup for all quiz API endpoints.

---

## 📍 Base URL
```
http://localhost:5000/api/test
```

---

## 🔑 Authentication

All endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 📋 Endpoints

### 1️⃣ Create Test (Teacher Only)

```
POST /create
```

**Request:**
```json
{
  "title": "Biology Quiz 1",
  "courseId": "6507c1d4e1b2a3f4c5d6e7f8"
}
```

**Response:**
```json
{
  "message": "Test created successfully",
  "testId": "6507c1d4e1b2a3f4c5d6e7f9"
}
```

**Status Codes:**
- 201 Success
- 400 Missing fields
- 401 Not authenticated
- 403 Not a teacher
- 500 Server error

---

### 2️⃣ Add Question (Teacher Only)

```
POST /question
```

**Request:**
```json
{
  "testId": "6507c1d4e1b2a3f4c5d6e7f9",
  "questionText": "What is photosynthesis?",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A"
}
```

**Response:**
```json
{
  "message": "Question added successfully",
  "questionId": "6507c1d4e1b2a3f4c5d6e7fa"
}
```

**Status Codes:**
- 201 Success
- 400 Invalid data
- 401 Not authenticated
- 403 Not a teacher
- 404 Test not found
- 500 Server error

---

### 3️⃣ Get Test (Any Authenticated User)

```
GET /:testId
```

**URL:**
```
/6507c1d4e1b2a3f4c5d6e7f9
```

**Response:**
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
      "options": ["A", "B", "C", "D"]
    }
  ],
  "totalQuestions": 1
}
```

**Note:** Correct answers are NOT included

**Status Codes:**
- 200 Success
- 401 Not authenticated
- 404 Test not found
- 500 Server error

---

### 4️⃣ Submit Test (Any Authenticated User)

```
POST /submit
```

**Request:**
```json
{
  "testId": "6507c1d4e1b2a3f4c5d6e7f9",
  "answers": [
    {
      "questionId": "6507c1d4e1b2a3f4c5d6e7fa",
      "selectedAnswer": "A"
    },
    {
      "questionId": "6507c1d4e1b2a3f4c5d6e7fb",
      "selectedAnswer": "B"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Test submitted successfully",
  "testResult": {
    "_id": "6507c1d4e1b2a3f4c5d6e7fc",
    "score": 100,
    "correctAnswers": 2,
    "totalQuestions": 2
  },
  "answers": [
    {
      "questionId": "6507c1d4e1b2a3f4c5d6e7fa",
      "selectedAnswer": "A",
      "isCorrect": true
    },
    {
      "questionId": "6507c1d4e1b2a3f4c5d6e7fb",
      "selectedAnswer": "B",
      "isCorrect": true
    }
  ]
}
```

**Status Codes:**
- 200 Success
- 400 Missing fields
- 401 Not authenticated
- 404 Test not found
- 500 Server error

---

## 🔐 Role Access

| Route | Teacher | Student |
|-------|---------|---------|
| POST /create | ✅ | ❌ |
| POST /question | ✅ | ❌ |
| GET /:testId | ✅ | ✅ |
| POST /submit | ✅ | ✅ |

---

## 📊 Models

### Test
```
_id: ObjectId
title: String
courseId: ObjectId (ref: Course)
createdBy: ObjectId (ref: User)
createdAt: Date
```

### Question
```
_id: ObjectId
testId: ObjectId (ref: Test)
questionText: String
options: [String]
correctAnswer: String
createdAt: Date
```

### TestResult
```
_id: ObjectId
testId: ObjectId (ref: Test)
studentId: ObjectId (ref: User)
score: Number (0-100)
answers: [
  {
    questionId: ObjectId,
    selectedAnswer: String,
    isCorrect: Boolean
  }
]
submittedAt: Date
```

---

## 🧪 Postman Collection

### Create Test
```
POST http://localhost:5000/api/test/create
Headers:
  - Authorization: Bearer {{token}}
  - Content-Type: application/json
Body:
  {
    "title": "Test Title",
    "courseId": "{{courseId}}"
  }
```

### Add Question
```
POST http://localhost:5000/api/test/question
Headers:
  - Authorization: Bearer {{token}}
  - Content-Type: application/json
Body:
  {
    "testId": "{{testId}}",
    "questionText": "Question text?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }
```

### Get Test
```
GET http://localhost:5000/api/test/{{testId}}
Headers:
  - Authorization: Bearer {{token}}
```

### Submit Test
```
POST http://localhost:5000/api/test/submit
Headers:
  - Authorization: Bearer {{token}}
  - Content-Type: application/json
Body:
  {
    "testId": "{{testId}}",
    "answers": [
      {
        "questionId": "{{questionId1}}",
        "selectedAnswer": "A"
      },
      {
        "questionId": "{{questionId2}}",
        "selectedAnswer": "B"
      }
    ]
  }
```

---

## ✅ Example Workflow

### Step 1: Teacher Creates Test
```bash
curl -X POST http://localhost:5000/api/test/create \
  -H "Authorization: Bearer teacher_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Math Quiz",
    "courseId": "60d5ec49c1234567890abcde"
  }'

# Response:
# {"message": "Test created successfully", "testId": "60d5ec50c1234567890abcde"}
```

### Step 2: Teacher Adds Questions
```bash
curl -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer teacher_token" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "60d5ec50c1234567890abcde",
    "questionText": "2+2=?",
    "options": ["2", "3", "4", "5"],
    "correctAnswer": "4"
  }'

# Response:
# {"message": "Question added successfully", "questionId": "60d5ec51c1234567890abcde"}
```

### Step 3: Student Gets Test
```bash
curl -X GET http://localhost:5000/api/test/60d5ec50c1234567890abcde \
  -H "Authorization: Bearer student_token"

# Response:
# {
#   "test": {...},
#   "questions": [{...}],
#   "totalQuestions": 1
# }
```

### Step 4: Student Submits Test
```bash
curl -X POST http://localhost:5000/api/test/submit \
  -H "Authorization: Bearer student_token" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "60d5ec50c1234567890abcde",
    "answers": [{
      "questionId": "60d5ec51c1234567890abcde",
      "selectedAnswer": "4"
    }]
  }'

# Response:
# {
#   "message": "Test submitted successfully",
#   "testResult": {
#     "score": 100,
#     "correctAnswers": 1,
#     "totalQuestions": 1
#   }
# }
```

---

## 🔍 Error Responses

### 400 Bad Request
```json
{
  "message": "Title is required"
}
```

### 401 Unauthorized
```json
{
  "message": "User not authenticated"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Only teacher can access this."
}
```

### 404 Not Found
```json
{
  "message": "Test not found"
}
```

### 500 Server Error
```json
{
  "message": "Error creating test"
}
```

---

## 💡 Tips

1. **Always send Authorization header** with Bearer token
2. **Correct answers are hidden** when getting test (security)
3. **Score is calculated automatically** when submitting
4. **Teachers can create multiple tests** for one course
5. **Students can take test multiple times** (results saved separately)

---

**Ready to test with Postman or curl! 🚀**
