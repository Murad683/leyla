const prisma = require('../config/prisma');

const FIELDS = ['title', 'description', 'fileUrl', 'isActive'];

const pick = (body) => {
  const out = {};
  for (const k of FIELDS) {
    if (body[k] === undefined) continue;
    out[k] = body[k];
  }
  return out;
};

const getLeadMagnet = async (req, res, next) => {
  try {
    const item = await prisma.leadMagnet.findUnique({ where: { id: 1 } });
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const updateLeadMagnet = async (req, res, next) => {
  try {
    const data = pick(req.body || {});
    const item = await prisma.leadMagnet.upsert({
      where: { id: 1 },
      update: data,
      create: { ...data, id: 1 },
    });
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeadMagnet, updateLeadMagnet };
