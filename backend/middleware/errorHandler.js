const logger = require('../utils/logger');

/**
 * Centralized Error Handling Middleware
 * Production-ready: hides stack traces and formats errors
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Log error for internal monitoring
  logger.error(`${req.method} ${req.url} - ${statusCode} - ${err.message}`, {
    stack: isProduction ? null : err.stack,
    body: req.body,
    params: req.params,
    query: req.query
  });

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && isProduction 
      ? 'Daxili server xətası baş verdi.' 
      : err.message,
    errors: err.errors || [],
    ...(isProduction ? {} : { stack: err.stack })
  });
};

module.exports = errorHandler;
