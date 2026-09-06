const prisma = require('../config/prisma');

const slugify = (s = '') =>
  s.toString().toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const getCourses = async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data.slug) data.slug = slugify(data.title) || `course-${Date.now()}`;
    const course = await prisma.course.create({ data });
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const data = { ...req.body };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    const course = await prisma.course.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    await prisma.course.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourses, createCourse, updateCourse, deleteCourse };
