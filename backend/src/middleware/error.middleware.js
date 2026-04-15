const ApiError = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      details: err.message,
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
  });
};

module.exports = errorHandler;
