/**
 * Builds a reusable request validator for route owners. The validator receives
 * (req) and may return an error message, throw an Error, or resolve a Promise.
 */
function validateRequest(validator) {
  if (typeof validator !== 'function') {
    throw new TypeError('Request validator must be a function');
  }

  return async (req, res, next) => {
    try {
      const result = await validator(req);
      if (typeof result === 'string') {
        const error = new Error(result);
        error.statusCode = 400;
        return next(error);
      }
      return next();
    } catch (error) {
      error.statusCode = error.statusCode || 400;
      return next(error);
    }
  };
}

module.exports = { validateRequest };
