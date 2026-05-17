const { body, validationResult } = require('express-validator');

const validateContact = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long.'),
  body('email').trim().isEmail().withMessage('Must be a valid email address.'),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('service').optional().trim(),
  body('budget').optional().trim(),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long.'),
  body('subject').optional().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
      });
    }
    next();
  }
];

module.exports = {
  validateContact
};
