const prisma = require('../config/prisma');

const submitContactForm = async (req, res, next) => {
  try {
    const contact = await prisma.contact.create({
      data: {
        ...req.body,
        ipAddress: req.ip || req.connection.remoteAddress
      }
    });
    res.json({ success: true, message: 'Message sent successfully', data: contact });
  } catch (error) {
    next(error);
  }
};

// Admin functions
const getContacts = async (req, res, next) => {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: contacts });
  } catch (error) {
    next(error);
  }
};

const markContactAsRead = async (req, res, next) => {
  try {
    const contact = await prisma.contact.update({
      where: { id: parseInt(req.params.id) },
      data: { isRead: true }
    });
    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactForm,
  getContacts,
  markContactAsRead
};
