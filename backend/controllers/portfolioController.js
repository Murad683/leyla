const portfolioQueries = require('../services/db/portfolioQueries');

const getPortfolioItems = async (req, res, next) => {
  try {
    const category = req.query.category || null;
    const featured = req.query.featured ? req.query.featured === 'true' : null;

    const { items, total } = await portfolioQueries.getPortfolioItems(category, featured);

    res.json({
      success: true,
      data: {
        items,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

const getPortfolioItemBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const item = await portfolioQueries.getPortfolioItemBySlug(slug);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPortfolioItems,
  getPortfolioItemBySlug
};
