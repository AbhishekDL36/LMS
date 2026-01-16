// api.js - Simple Axios configuration for API calls
// This file handles all backend communication with automatic token attachment

import axios from 'axios';

// Create an axios instance with base URL pointing to our backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this if your backend is on a different port
  timeout: 10000, // 10 second timeout for requests
});

// Add a request interceptor to automatically attach the auth token
// This runs BEFORE every API request
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (we save it after login)
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // If there's an error preparing the request, reject it
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
// This runs AFTER every API response
api.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error) => {
    // If token is expired or unauthorized, clear it and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
