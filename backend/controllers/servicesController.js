const prisma = require('../config/prisma');

const getServices = async (req, res, next) => {
  try {
    const services = await prisma.serviceItem.findMany();
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const service = await prisma.serviceItem.create({ data: req.body });
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const service = await prisma.serviceItem.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    await prisma.serviceItem.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService
};
