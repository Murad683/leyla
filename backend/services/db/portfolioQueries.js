const { pool } = require('../../config/db');

const getPortfolioItems = async (category = null, featured = null) => {
  let query = 'SELECT id, slug, title, category, tags, summary, thumbnail, featured, year, client, duration, role FROM portfolio_items WHERE is_published = TRUE';
  const params = [];
  let paramIndex = 1;

  if (category) {
    query += ` AND category = $${paramIndex++}`;
    params.push(category);
  }
  
  if (featured !== null) {
    query += ` AND featured = $${paramIndex++}`;
    params.push(featured);
  }

  query += ' ORDER BY featured DESC, created_at DESC';

  const { rows } = await pool.query(query, params);
  
  return {
    items: rows,
    total: rows.length
  };
};

const getPortfolioItemBySlug = async (slug) => {
  const query = 'SELECT id, slug, title, category, tags, summary, thumbnail, featured, year, client, duration, role, challenge, solution, results, sections, tools, cta_label as "ctaLabel", cta_href as "ctaHref" FROM portfolio_items WHERE slug = $1 AND is_published = TRUE';
  const { rows } = await pool.query(query, [slug]);
  return rows[0] || null;
};

module.exports = {
  getPortfolioItems,
  getPortfolioItemBySlug
};
