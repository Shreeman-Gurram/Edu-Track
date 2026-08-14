const {
  registerUser,
  loginUser,
  getUserById,
} = require('../services/authService');

function getErrorStatusCode(error) {
  return error.statusCode || 500;
}

function register(req, res) {
  const { name, email, password, role, grade } = req.body || {};

  return registerUser({ name, email, password, role, grade })
    .then(({ user, token }) => {
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
        token,
      });
    })
    .catch((error) => {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: error.message || 'Failed to register user',
      });
    });
}

function login(req, res) {
  const { email, password } = req.body || {};

  return loginUser({ email, password })
    .then(({ user, token }) => {
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user,
        token,
      });
    })
    .catch((error) => {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: error.message || 'Failed to login',
      });
    });
}

function getCurrentUser(req, res) {
  return getUserById(req.user.userId)
    .then((user) => {
      return res.status(200).json({
        success: true,
        user,
      });
    })
    .catch((error) => {
      const statusCode = error.statusCode === 404 ? 401 : getErrorStatusCode(error);

      return res.status(statusCode).json({
        success: false,
        message: error.statusCode === 404 ? 'User no longer exists' : error.message,
      });
    });
}

module.exports = {
  register,
  login,
  getCurrentUser,
};
