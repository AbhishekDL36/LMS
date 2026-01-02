require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const roleRoutes = require('./routes/roles'); // 👈 STEP-4
const courseRoutes = require('./routes/course');
const lectureRoutes = require('./routes/lecture');


const app = express();

// DB connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'LMS API Server' });
});

// Step-2
app.use('/api/auth', authRoutes);

// Step-3
app.use('/api/test', protectedRoutes);

// Step-4 👇 IMPORTANT
app.use('/api/role', roleRoutes);

app.use('/api/course', courseRoutes);

// Lecture routes
app.use('/api/lecture', lectureRoutes);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
