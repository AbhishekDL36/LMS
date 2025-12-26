const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User Schema
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: true,
  },
  
  // User's email (must be unique)
  email: {
    type: String,
    required: true,
    unique: true,
  },
  
  // User's password (will be hashed before saving)
  password: {
    type: String,
    required: true,
  },
  
  // User's role (student or teacher)
  role: {
    type: String,
    default: 'student',
  },
});

// Before saving user, hash the password
userSchema.pre('save', async function (next) {
  // If password is not modified, skip hashing
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt (complexity level 10)
    const salt = await bcrypt.genSalt(10);
    
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    
    // Continue to save
    next();
  } catch (error) {
    next(error);
  }
});

// Create User model from schema
const User = mongoose.model('User', userSchema);

module.exports = User;
