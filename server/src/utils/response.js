function successResponse(res, { statusCode = 200, message, ...payload } = {}) {
  return res.status(statusCode).json({
    success: true,
    ...(message ? { message } : {}),
    ...payload,
  });
}

function errorResponse(res, { statusCode = 500, message = 'Internal server error', ...payload } = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...payload,
  });
}

module.exports = { successResponse, errorResponse };
