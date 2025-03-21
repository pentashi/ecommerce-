const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Password is now optional
    isAdmin: { type: Boolean, default: false },
    provider: { type: String }, // e.g., 'google', 'facebook'
    providerId: { type: String }, // ID from the OAuth provider
    avatar: { type: String, default: '' }, // Optional field to store avatar URL
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
