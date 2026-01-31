#!/bin/bash

# LMS Authentication System - Setup Commands
# Run these commands to get the system up and running

echo "======================================"
echo "LMS Authentication System Setup"
echo "======================================"
echo ""

# Backend Setup
echo "📦 Backend Setup..."
echo "------------------------------------"
echo "cd backend"
echo "npm install"
echo ""
echo "Then create .env file with:"
echo "MONGO_URI=your_mongodb_uri"
echo "JWT_SECRET=your_secret_key_min_32_chars"
echo "PORT=5000"
echo "GOOGLE_CLIENT_ID=your_google_client_id"
echo "NODE_ENV=development"
echo ""
echo "Start backend:"
echo "npm run dev"
echo ""

# Frontend Setup
echo "Frontend Setup..."
echo "------------------------------------"
echo "cd frontend"
echo "npm install"
echo ""
echo "Then create .env.local file with:"
echo "VITE_API_URL=http://localhost:5000/api"
echo "VITE_GOOGLE_CLIENT_ID=your_google_client_id"
echo ""
echo "Start frontend:"
echo "npm run dev"
echo ""

# Testing
echo "Testing..."
echo "------------------------------------"
echo "1. Open http://localhost:5173"
echo "2. Click 'Register' to create account"
echo "3. Enter name, email, password"
echo "4. Select role (student/teacher)"
echo "5. Click 'Register'"
echo "6. Should redirect to dashboard"
echo ""

# Google OAuth
echo "Google OAuth Setup..."
echo "------------------------------------"
echo "1. Go to https://console.cloud.google.com"
echo "2. Create new project"
echo "3. Enable Google+ API"
echo "4. Create OAuth 2.0 credentials"
echo "5. Add http://localhost:5173 as redirect URI"
echo "6. Copy Client ID to .env files"
echo ""

echo "======================================"
echo "Setup Complete!"
echo "======================================"
