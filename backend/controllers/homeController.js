const prisma = require('../config/prisma');

const getHome = async (req, res, next) => {
  try {
    const home = await prisma.homeContent.findUnique({ where: { id: 1 } });
    res.json({ success: true, data: home });
  } catch (error) {
    next(error);
  }
};

const updateHome = async (req, res, next) => {
  try {
    const data = { ...req.body };
    delete data.id;
    delete data.updatedAt;
    const home = await prisma.homeContent.upsert({
      where: { id: 1 },
      update: data,
      create: { ...data, id: 1 },
    });
    res.json({ success: true, data: home });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHome, updateHome };
