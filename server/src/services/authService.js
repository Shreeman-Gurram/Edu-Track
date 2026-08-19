const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const { sendPasswordResetEmail } = require('./emailService');

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    grade: user.grade,
  };
}

function generateToken(user) {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!jwtSecret) {
    throw createError('JWT configuration missing', 500);
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
}

async function registerUser({ name, email, password, role, grade }) {
  const normalizedEmail = (email || '').toLowerCase().trim();
  const normalizedGrade = String(grade || '').trim();

  if (!name || !normalizedEmail || !password) {
    throw createError('Name, email, and password are required', 400);
  }

  if (!isValidEmail(normalizedEmail)) {
    throw createError('Invalid email format', 400);
  }

  if (password.length < 6) {
    throw createError('Password must be at least 6 characters long', 400);
  }

  if (!normalizedGrade) {
    throw createError('Grade is required', 400);
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw createError('Email is already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
    grade: normalizedGrade,
  });

  const token = generateToken(user);

  return {
    user: formatUser(user),
    token,
  };
}

async function loginUser({ email, password }) {
  const normalizedEmail = (email || '').toLowerCase().trim();

  if (!normalizedEmail || !password) {
    throw createError('Email and password are required', 400);
  }

  if (!isValidEmail(normalizedEmail)) {
    throw createError('Invalid email format', 400);
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401);
  }

  const token = generateToken(user);

  return {
    user: formatUser(user),
    token,
  };
}

async function getUserById(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw createError('User not found', 404);
  }

  return formatUser(user);
}

async function forgotPassword({ email }) {
  const normalizedEmail = (email || '').toLowerCase().trim();

  if (!normalizedEmail) {
    throw createError('Email is required', 400);
  }

  if (!isValidEmail(normalizedEmail)) {
    throw createError('Invalid email format', 400);
  }

  // Always return the same generic message to prevent email enumeration
  const genericMessage = 'If an account exists for this email, a password reset link has been sent.';

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    // Return generic message even if user doesn't exist
    return { message: genericMessage };
  }

  // Generate a secure random reset token
  const rawToken = crypto.randomBytes(32).toString('hex');

  // Store only the SHA-256 hash of the token in the database
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  // Set token expiry to 30 minutes
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();

  // Build the reset URL using the raw (unhashed) token
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

  try {
    await sendPasswordResetEmail({ email: normalizedEmail, resetUrl });
  } catch (err) {
    // If email sending fails, clear the token so it can't be used
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    throw createError('Failed to send reset email. Please try again.', 500);
  }

  return { message: genericMessage };
}

async function resetPassword({ token, password }) {
  if (!token) {
    throw createError('Reset token is required', 400);
  }

  if (!password || password.length < 6) {
    throw createError('Password must be at least 6 characters long', 400);
  }

  // Hash the incoming token to match the stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with matching token that has not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw createError('Invalid or expired reset token', 400);
  }

  // Hash the new password using existing bcrypt implementation
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update password and clear the reset token (single-use)
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return { message: 'Password has been reset successfully.' };
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  forgotPassword,
  resetPassword,
};
