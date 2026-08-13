const jwt = require('jsonwebtoken');

const User = require('../models/User');

function protect(req, res, next) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token is missing',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token is missing',
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      success: false,
      message: 'JWT configuration missing',
    });
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecret);

    if (!decodedToken.userId || !decodedToken.role) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload',
      });
    }

    return User.findById(decodedToken.userId)
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'User no longer exists',
          });
        }

        req.user = {
          _id: user._id,
          userId: user._id.toString(),
          role: user.role,
        };

        return next();
      })
      .catch(() => {
        return res.status(500).json({
          success: false,
          message: 'Failed to verify authenticated user',
        });
      });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
}

module.exports = {
  protect,
  adminOnly(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access is required' });
    }
    return next();
  },
};
