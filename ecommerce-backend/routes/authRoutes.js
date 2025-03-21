const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');  // <-- Correct the import to 'auth' here
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const passport = require('../config/passport');
const multer = require('multer');  // <-- Add multer for file uploads
const router = express.Router();

// Set up multer storage configuration for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  // Custom file name to avoid overwriting
  },
});

const upload = multer({ storage });  // Initialize multer with the storage config

// REGISTER
router.post(
  '/register',
  [
    body('name').not().isEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('isAdmin').optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, isAdmin } = req.body;

    // Ensure that only an existing admin can create an admin
    if (isAdmin && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Only admins can create other admins' });
    }

    try {
      const userExists = await User.findOne({ email });
      if (userExists)
        return res.status(400).json({ message: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false,
      });

      await user.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// LOGIN
router.post(
  '/login',
  [body('email').isEmail(), body('password').exists()],
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: 'Invalid email or password' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: 'Invalid email or password' });

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      res.json({ token, userId: user._id, isAdmin: user.isAdmin });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Google OAuth: Initiate login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth: Callback URL
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const { id, displayName, emails } = req.user;
      const email = emails[0].value;

      let user = await User.findOne({ providerId: id, provider: 'google' });
      if (!user) {
        user = new User({
          name: displayName,
          email,
          provider: 'google',
          providerId: id,
        });
        await user.save();
      }

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Redirect with token
      res.redirect(`http://localhost:3000/oauth-success?token=${token}&userId=${user._id}`);
    } catch (err) {
      res.redirect('http://localhost:3000/login?error=OAuthLoginFailed');
    }
  }
);


// Facebook OAuth: Initiate login
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
// Facebook OAuth: Callback URL
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const { id, displayName, emails } = req.user;
      const email = emails[0].value;

      let user = await User.findOne({ providerId: id, provider: 'facebook' });
      if (!user) {
        user = new User({
          name: displayName,
          email,
          provider: 'facebook',
          providerId: id,
        });
        await user.save();
      }

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Redirect with token
      res.redirect(`http://localhost:3000/oauth-success?token=${token}&userId=${user._id}`);
    } catch (err) {
      res.redirect('http://localhost:3000/login?error=OAuthLoginFailed');
    }
  }
);
// GET User Profile - Authenticated Route
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Get user by ID from the token payload
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ name: user.name, avatar: user.avatar || '', email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Avatar Upload Route
router.post('/upload-avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save the uploaded avatar file path in the database
    const avatarUrl = `/uploads/${req.file.filename}`; // You might want to use a full URL if serving from a public folder

    user.avatar = avatarUrl; // Save avatar URL to the user's profile
    await user.save();

    res.status(200).json({
      message: 'Avatar uploaded successfully',
      avatar: avatarUrl,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PROFILE
router.put(
  '/profile',
  verifyToken, // Protect the route with the existing token verification middleware
  [
    body('name').optional().not().isEmpty(),
    body('avatar').optional().isURL(),
  ],
  async (req, res) => {
    const { name, avatar } = req.body;

    // Ensure that the user is logged in and the profile is being updated by the correct user
    try {
      const userId = req.user.id; // From the token (your middleware already attaches the user)
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update fields if provided
      if (name) user.name = name;
      if (avatar) user.avatar = avatar;

      await user.save();

      res.status(200).json({
        message: 'Profile updated successfully',
        user: { name: user.name, avatar: user.avatar },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
