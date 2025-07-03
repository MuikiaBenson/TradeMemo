// Import mongoose for schema and model creation
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare hashed password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
module.exports = mongoose.model('User', userSchema);

