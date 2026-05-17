const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validateContact } = require('../middleware/validator');
const { contactRateLimiter } = require('../middleware/rateLimiter');

router.post('/', contactRateLimiter, validateContact, contactController.submitContact);

module.exports = router;
