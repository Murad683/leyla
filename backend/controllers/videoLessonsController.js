const prisma = require('../config/prisma');

const getVideoLessons = async (req, res, next) => {
  try {
    const items = await prisma.videoLesson.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const createVideoLesson = async (req, res, next) => {
  try {
    const item = await prisma.videoLesson.create({ data: req.body });
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const updateVideoLesson = async (req, res, next) => {
  try {
    const data = { ...req.body };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    const item = await prisma.videoLesson.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const deleteVideoLesson = async (req, res, next) => {
  try {
    await prisma.videoLesson.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVideoLessons,
  createVideoLesson,
  updateVideoLesson,
  deleteVideoLesson,
};
