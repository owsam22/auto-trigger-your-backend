const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');
const User = require('../models/User');
const protect = require('../middleware/auth');
const { getVerificationEmailTemplate } = require('../utils/emailTemplates');

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_EMAILS_PER_DAY = 2;
const TOKEN_EXPIRY_MINUTES = 10;

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a JWT that carries the user's verified status */
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, isEmailVerified: user.isEmailVerified },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

/** Generate a secure random hex token */
const generateVerificationToken = () =>
  crypto.randomBytes(32).toString('hex');

/**
 * Send a verification email via Resend.
 * Returns true on success, throws on failure.
 */
async function sendVerificationEmail(user, token) {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const { subject, html } = getVerificationEmailTemplate(verificationUrl, user.email);

  await resend.emails.send({
    from: 'TriggerPulse <onboarding@resend.dev>',
    to: [user.email],
    subject,
    html,
  });
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Email already registered' });

    // Generate email verification token
    const verificationToken = generateVerificationToken();
    const expiry = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

    const user = await User.create({
      email,
      password,
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: expiry,
      verificationEmailsSentToday: 1,
      verificationEmailsSentDate: new Date(),
    });

    // Send verification email (non-blocking — don't fail registration if email fails)
    try {
      await sendVerificationEmail(user, verificationToken);
    } catch (emailErr) {
      console.error('⚠️ Verification email failed to send:', emailErr.message);
    }

    res.status(201).json({
      token: generateToken(user),
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isEmailVerified && !user.isAdmin) {
      return res.status(403).json({
        message: 'Please verify your email before logging in.',
        requiresVerification: true,
        token: generateToken(user),
        user: {
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
          isEmailVerified: false,
        },
      });
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/verify-email?token=<token> ──────────────────────────────────
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  if (!token)
    return res.status(400).json({ message: 'Verification token is required' });

  try {
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user)
      return res.status(400).json({ message: 'Invalid or already used verification link.' });

    if (user.emailVerificationExpiry < new Date())
      return res.status(400).json({
        message: 'Verification link has expired. Please request a new one.',
        expired: true,
      });

    // Mark verified and clear the token
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiry = null;
    await user.save();

    // Issue a new full-access JWT
    res.json({
      message: 'Email verified successfully!',
      token: generateToken(user),
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        isEmailVerified: true,
      },
    });
  } catch (err) {
    console.error('Verify Email Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/check-verified (requires auth token) ────────────────────────
// Used by the VerifyEmail page to poll for verification status
router.get('/check-verified', protect, async (req, res) => {
  // req.user is fetched fresh from DB by protect middleware
  if (req.user.isEmailVerified) {
    return res.json({
      isEmailVerified: true,
      token: generateToken(req.user),
      user: {
        id: req.user._id,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        isEmailVerified: true,
      },
    });
  }
  res.json({ isEmailVerified: false });
});

// ── POST /api/auth/resend-verification (requires auth token) ──────────────────
router.post('/resend-verification', protect, async (req, res) => {
  const user = req.user;

  if (user.isEmailVerified)
    return res.status(400).json({ message: 'Your email is already verified.' });

  // ── Daily limit check ──
  const today = new Date();
  const sentDate = user.verificationEmailsSentDate;
  const isNewDay =
    !sentDate ||
    sentDate.toDateString() !== today.toDateString();

  if (isNewDay) {
    // Reset the counter for the new day
    user.verificationEmailsSentToday = 0;
    user.verificationEmailsSentDate = today;
  }

  if (user.verificationEmailsSentToday >= MAX_EMAILS_PER_DAY) {
    return res.status(429).json({
      message: `You've reached the daily limit of ${MAX_EMAILS_PER_DAY} verification emails. Please try again tomorrow.`,
      limitReached: true,
    });
  }

  // Generate a fresh token
  const verificationToken = generateVerificationToken();
  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpiry = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);
  user.verificationEmailsSentToday += 1;
  user.verificationEmailsSentDate = today;
  await user.save();

  try {
    await sendVerificationEmail(user, verificationToken);
    res.json({
      message: 'Verification email sent! Check your inbox.',
      emailsSentToday: user.verificationEmailsSentToday,
      emailsRemaining: MAX_EMAILS_PER_DAY - user.verificationEmailsSentToday,
    });
  } catch (emailErr) {
    console.error('Resend email failed:', emailErr.message);
    res.status(500).json({ message: 'Failed to send email. Please try again.' });
  }
});

module.exports = router;
