const prisma = require('../config/prisma');

// Only columns that exist on HomeContent — anything else in the body is ignored
// (the admin form carries transient helpers like `_introParagraphs`).
const FIELDS = [
  'introEyebrow', 'introStatement', 'introAccent', 'introParagraphs', 'introTags',
  'numbersEyebrow', 'stats',
  'processEyebrow', 'processHeadline', 'processSteps',
  'coursesEyebrow', 'coursesHeadline', 'courseHow', 'courseFaq',
  'quotesEyebrow',
];
const ARRAY_FIELDS = ['introParagraphs', 'introTags'];

const pick = (body) => {
  const out = {};
  for (const k of FIELDS) {
    if (body[k] === undefined) continue;
    if (ARRAY_FIELDS.includes(k)) {
      out[k] = Array.isArray(body[k]) ? body[k] : [];
    } else {
      out[k] = body[k];
    }
  }
  return out;
};

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
    const data = pick(req.body || {});
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
