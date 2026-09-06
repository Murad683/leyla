const prisma = require('../config/prisma');

const getTestimonials = async (req, res, next) => {
  try {
    const items = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const createTestimonial = async (req, res, next) => {
  try {
    const item = await prisma.testimonial.create({ data: req.body });
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const data = { ...req.body };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    const item = await prisma.testimonial.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    await prisma.testimonial.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
