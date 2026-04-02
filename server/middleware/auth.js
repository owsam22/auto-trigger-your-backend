const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — verifies JWT and attaches the fresh user from DB to req.user
 * Does NOT check email verification — use requireVerified for that.
 */
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Always fetch fresh from DB — never trust client-side JWT claims for sensitive state
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

/**
 * requireVerified — must come AFTER protect.
 * Blocks any route from users whose email is not verified.
 * Since req.user is always fetched fresh from DB, this CANNOT be spoofed
 * by editing localStorage, JWT payload, or browser JS.
 */
const requireVerified = (req, res, next) => {
  if (!req.user.isEmailVerified && !req.user.isAdmin) {
    return res.status(403).json({
      message: 'Please verify your email address to access this feature.',
      requiresVerification: true,
    });
  }
  next();
};

module.exports = protect;
module.exports.requireVerified = requireVerified;
