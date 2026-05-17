const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmailNotification = async (contact) => {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      logger.warn('SMTP configuration missing, skipping email notification.');
      return;
    }

    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"LeylaDigital" <no-reply@leyladigital.com>',
      to: process.env.CONTACT_EMAIL_TO || process.env.SMTP_USER,
      subject: `New Contact Request: ${contact.subject || 'No Subject'}`,
      text: `Name: ${contact.name}\nEmail: ${contact.email}\nSubject: ${contact.subject}\n\nMessage:\n${contact.message}`,
      html: `
        <h3>New Contact Request</h3>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message}</p>
      `
    });
    logger.info('Email notification sent successfully.');
  } catch (error) {
    logger.error('Failed to send email notification:', error);
  }
};

module.exports = {
  sendEmailNotification
};
