const contactQueries = require('../services/db/contactQueries');
const { sendEmailNotification } = require('../services/emailService');
const logger = require('../utils/logger');

const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, company, service, budget, subject, message } = req.body;
    const ip_address = req.ip;

    const contactData = { name, email, phone, company, service, budget, subject, message, ip_address };
    const savedContact = await contactQueries.insertContact(contactData);

    // Send email non-blocking
    sendEmailNotification(contactData).catch(err => logger.error('Email error:', err));

    res.status(201).json({
      success: true,
      data: savedContact
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact
};
