const prisma = require('../config/prisma');

const getSettings = async (req, res, next) => {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: req.body,
      create: { ...req.body, id: 1 }
    });
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
