# STEP-19A: Add Questions to Quiz - API Testing Guide

## Overview

This guide provides curl commands and Postman examples to test the quiz question creation endpoints.

---

## Prerequisites

- Backend running on `http://localhost:5000`
- MongoDB running and connected
- Valid JWT token (from login)
- A valid testId (from creating a quiz)

---

## Step 1: Get Auth Token

### Login as Teacher

**Using Postman:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "teacher@example.com",
  "password": "password123"
}
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"password123"}'
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "teacher",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Save the token for next steps:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Step 2: Create a Quiz (Test)

### Create Quiz for Testing

**Using Postman:**
```
POST http://localhost:5000/api/test/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "React Quiz",
  "courseId": "507f1f77bcf86cd799439012"
}
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/test/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Quiz",
    "courseId": "507f1f77bcf86cd799439012"
  }'
```

**Response:**
```json
{
  "message": "Test created successfully",
  "testId": "607f1f77bcf86cd799439013"
}
```

**Save the testId for next steps:**
```bash
TEST_ID="607f1f77bcf86cd799439013"
```

---

## Step 3: Add Question to Quiz

### Test Case 1: Valid Question

**Using Postman:**
```
POST http://localhost:5000/api/test/question
Authorization: Bearer {token}
Content-Type: application/json

{
  "testId": "607f1f77bcf86cd799439013",
  "questionText": "What is React?",
  "options": [
    "A JavaScript library for building UIs",
    "A programming language",
    "A database framework",
    "A server-side runtime"
  ],
  "correctAnswer": "A JavaScript library for building UIs"
}
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "'$TEST_ID'",
    "questionText": "What is React?",
    "options": [
      "A JavaScript library for building UIs",
      "A programming language",
      "A database framework",
      "A server-side runtime"
    ],
    "correctAnswer": "A JavaScript library for building UIs"
  }'
```

**Response (201):**
```json
{
  "message": "Question added successfully",
  "questionId": "707f1f77bcf86cd799439014"
}
```

---

### Test Case 2: Invalid Token

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "'$TEST_ID'",
    "questionText": "What is Node.js?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }'
```

**Response (401):**
```json
{
  "message": "Unauthorized"
}
```

---

### Test Case 3: Student Token (Not Teacher)

**Step 1: Login as student**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'
```

**Step 2: Try to add question with student token**
```bash
curl -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "'$TEST_ID'",
    "questionText": "What is React?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }'
```

**Response (403):**
```json
{
  "message": "Forbidden"
}
```

---

### Test Case 4: Missing Question Text

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "'$TEST_ID'",
    "questionText": "",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }'
```

**Response (400):**
```json
{
  "message": "Question text is required"
}
```

---

### Test Case 5: Missing Options

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "'$TEST_ID'",
    "questionText": "What is React?",
    "options": [],
    "correctAnswer": "A"
  }'
```

**Response (400):**
```json
{
  "message": "Options are required"
}
```

---

### Test Case 6: Correct Answer Not in Options

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "'$TEST_ID'",
    "questionText": "What is React?",
    "options": [
      "A JavaScript library",
      "A programming language",
      "A database",
      "A server framework"
    ],
    "correctAnswer": "A CSS framework"
  }'
```

**Response (400):**
```json
{
  "message": "Correct answer must be one of the options"
}
```

---

### Test Case 7: Invalid Test ID

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "invalid_id",
    "questionText": "What is React?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }'
```

**Response (404):**
```json
{
  "message": "Test not found"
}
```

---

### Test Case 8: Add Multiple Questions

**Question 1:**
```bash
curl -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "'$TEST_ID'",
    "questionText": "What is React?",
    "options": ["Library", "Language", "Database", "Framework"],
    "correctAnswer": "Library"
  }'
```

**Question 2:**
```bash
curl -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "'$TEST_ID'",
    "questionText": "What is JSX?",
    "options": ["HTML syntax", "Template", "XML-like syntax", "CSS"],
    "correctAnswer": "XML-like syntax"
  }'
```

**Question 3:**
```bash
curl -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "'$TEST_ID'",
    "questionText": "What is a Hook?",
    "options": ["Function", "Component", "State manager", "Router"],
    "correctAnswer": "Function"
  }'
```

---

## Step 4: Verify Questions in Database

### Query Questions by Test ID

**Using curl + MongoDB:**
```bash
# In MongoDB shell
db.questions.find({ testId: ObjectId("607f1f77bcf86cd799439013") })
```

**Expected output:**
```json
[
  {
    "_id": ObjectId("707f1f77bcf86cd799439014"),
    "testId": ObjectId("607f1f77bcf86cd799439013"),
    "questionText": "What is React?",
    "options": [
      "A JavaScript library for building UIs",
      "A programming language",
      "A database framework",
      "A server-side runtime"
    ],
    "correctAnswer": "A JavaScript library for building UIs",
    "createdAt": ISODate("2026-01-29T10:30:00Z")
  }
]
```

---

## Step 5: Get Questions for Quiz (Student View)

### Fetch Quiz with Questions

**Using Postman:**
```
GET http://localhost:5000/api/test/{testId}
Authorization: Bearer {token}
```

**Using curl:**
```bash
curl -X GET "http://localhost:5000/api/test/$TEST_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "test": {
    "_id": "607f1f77bcf86cd799439013",
    "title": "React Quiz",
    "courseId": "507f1f77bcf86cd799439012"
  },
  "questions": [
    {
      "_id": "707f1f77bcf86cd799439014",
      "questionText": "What is React?",
      "options": [
        "A JavaScript library for building UIs",
        "A programming language",
        "A database framework",
        "A server-side runtime"
      ]
    }
  ],
  "totalQuestions": 1
}
```

**Note:** `correctAnswer` is NOT included (for security)

---

## Complete Test Script

### All-in-One Testing Script

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=== STEP-19A API Testing ==="

# Step 1: Login as Teacher
echo -e "\n${GREEN}Step 1: Login as Teacher${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"teacher@example.com",
    "password":"password123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

# Step 2: Create Quiz
echo -e "\n${GREEN}Step 2: Create Quiz${NC}"
QUIZ_RESPONSE=$(curl -s -X POST http://localhost:5000/api/test/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Quiz",
    "courseId": "507f1f77bcf86cd799439012"
  }')

TEST_ID=$(echo $QUIZ_RESPONSE | grep -o '"testId":"[^"]*' | cut -d'"' -f4)
echo "Test ID: $TEST_ID"

# Step 3: Add Question 1
echo -e "\n${GREEN}Step 3: Add Question 1${NC}"
QUESTION1=$(curl -s -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "'$TEST_ID'",
    "questionText": "What is React?",
    "options": ["Library", "Language", "Database", "Framework"],
    "correctAnswer": "Library"
  }')
echo "$QUESTION1"

# Step 4: Add Question 2
echo -e "\n${GREEN}Step 4: Add Question 2${NC}"
QUESTION2=$(curl -s -X POST http://localhost:5000/api/test/question \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "testId": "'$TEST_ID'",
    "questionText": "What is JSX?",
    "options": ["HTML", "Template", "XML-like syntax", "CSS"],
    "correctAnswer": "XML-like syntax"
  }')
echo "$QUESTION2"

# Step 5: Get Quiz with Questions
echo -e "\n${GREEN}Step 5: Get Quiz with Questions${NC}"
QUIZ=$(curl -s -X GET "http://localhost:5000/api/test/$TEST_ID" \
  -H "Authorization: Bearer $TOKEN")
echo "$QUIZ" | jq '.'

echo -e "\n${GREEN}Testing Complete!${NC}"
```

---

## Expected Results Summary

| Test Case | Expected Status | Expected Message |
|-----------|-----------------|------------------|
| Valid question | 201 | "Question added successfully" |
| Invalid token | 401 | "Unauthorized" |
| Student user | 403 | "Forbidden" |
| Missing fields | 400 | Field-specific error message |
| Invalid testId | 404 | "Test not found" |
| Wrong answer option | 400 | "Correct answer must be one of the options" |
| Get quiz questions | 200 | Questions without correctAnswer |

---

## Postman Collection

Save as `quiz.postman_collection.json`:

```json
{
  "info": {
    "name": "LMS Quiz API",
    "description": "Quiz and Question APIs"
  },
  "item": [
    {
      "name": "Login Teacher",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"teacher@example.com\",\"password\":\"password123\"}"
        }
      }
    },
    {
      "name": "Create Quiz",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/test/create",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"title\":\"React Quiz\",\"courseId\":\"507f1f77bcf86cd799439012\"}"
        }
      }
    },
    {
      "name": "Add Question",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/test/question",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"testId\":\"{{testId}}\",\"questionText\":\"What is React?\",\"options\":[\"Library\",\"Language\",\"Database\",\"Framework\"],\"correctAnswer\":\"Library\"}"
        }
      }
    },
    {
      "name": "Get Quiz with Questions",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/test/{{testId}}",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ]
      }
    }
  ]
}
```

---

## Status Codes Reference

| Code | Meaning | Possible Cause |
|------|---------|----------------|
| 201 | Created | Question saved successfully |
| 400 | Bad Request | Missing required fields or invalid data |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | User is not a teacher |
| 404 | Not Found | Test/Quiz doesn't exist |
| 500 | Server Error | Database or server error |

---

## Debugging Tips

1. **Check Backend Logs**
   ```bash
   cd backend
   npm start
   # Look for error messages
   ```

2. **Check Token Validity**
   ```bash
   # Decode token at jwt.io
   # Make sure it has role: "teacher"
   ```

3. **Verify TestId Exists**
   ```bash
   # Use MongoDB Compass or:
   db.tests.findById(testId)
   ```

4. **Check CORS Settings**
   ```bash
   # Verify backend has CORS enabled in server.js
   # Should see: app.use(cors());
   ```

5. **Check Request Headers**
   ```bash
   # Must include:
   # Authorization: Bearer {valid_token}
   # Content-Type: application/json
   ```

---

**Status:** ✅ API Testing Guide Complete
**Last Updated:** January 29, 2026
**Test Coverage:** 8 test cases
