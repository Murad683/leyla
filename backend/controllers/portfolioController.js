const prisma = require('../config/prisma');

const getPortfolioItems = async (req, res, next) => {
  try {
    const category = req.query.category || undefined;
    const featured = req.query.featured === 'true' ? true : undefined;

    const where = {
      isPublished: true,
      ...(category && { category }),
      ...(featured !== undefined && { featured })
    };

    const items = await prisma.portfolioItem.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: { items } });
  } catch (error) {
    next(error);
  }
};

const getPortfolioItemBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const item = await prisma.portfolioItem.findUnique({ where: { slug } });

    if (!item || !item.isPublished) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// Admin CRUD
const createPortfolioItem = async (req, res, next) => {
  try {
    const item = await prisma.portfolioItem.create({ data: req.body });
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const updatePortfolioItem = async (req, res, next) => {
  try {
    const item = await prisma.portfolioItem.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const deletePortfolioItem = async (req, res, next) => {
  try {
    await prisma.portfolioItem.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPortfolioItems,
  getPortfolioItemBySlug,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
};
