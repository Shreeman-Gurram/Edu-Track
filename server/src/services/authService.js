const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

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

  if (!name || !normalizedEmail || !password) {
    throw createError('Name, email, and password are required', 400);
  }

  if (!isValidEmail(normalizedEmail)) {
    throw createError('Invalid email format', 400);
  }

  if (password.length < 6) {
    throw createError('Password must be at least 6 characters long', 400);
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
    grade,
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

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
