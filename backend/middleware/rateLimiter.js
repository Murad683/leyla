const rateLimit = require('express-rate-limit');

const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes.',
      errors: []
    });
  }
});

module.exports = {
  contactRateLimiter
};
