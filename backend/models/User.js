// Import mongoose for schema and model creation
const mongoose = require('mongoose');

// Define the user schema structure
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,              // Remove leading/trailing spaces
    minlength: 2             // Ensure name has at least 2 characters
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,         // Convert email to lowercase
    unique: true,            // Ensure no duplicate emails
    match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Basic regex validation
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,            // Minimum password length
    select: false            // Exclude password from query results by default
  },
  googleId: {
    type: String,
    default: null            // Optional field for Google OAuth
  },
  createdAt: {
    type: Date,
    default: Date.now        // Automatically set creation date
  }
}, {
  versionKey: false          // Optional: disables the `__v` version field
});

// Export the User model
module.exports = mongoose.model('User', userSchema);

