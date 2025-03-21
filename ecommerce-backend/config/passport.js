const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User'); // Adjust the path to your User model

// Serialize and deserialize user instances to and from the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,           // Set these in your environment variables
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create a user in your database
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          // You may add other fields as needed
        });
        await user.save();
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,         // Set these in your environment variables
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']   // Request these fields from Facebook
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id });
      if (!user) {
        user = new User({
          facebookId: profile.id,
          name: profile.displayName,
          email: profile.emails ? profile.emails[0].value : null,
        });
        await user.save();
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

module.exports = passport;
