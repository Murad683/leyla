const { pool } = require('../../config/db');

const getBlogPosts = async (limit = 6, offset = 0, category = null, featured = null) => {
  let query = 'SELECT id, slug, title, excerpt, category, tags, read_time as "readTime", published_at as "publishedAt", featured, cover_image as "coverImage", author_name as "authorName" FROM blog_posts WHERE is_published = TRUE';
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

  query += ` ORDER BY published_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  params.push(limit, offset);

  const { rows } = await pool.query(query, params);
  
  let countQuery = 'SELECT COUNT(*) FROM blog_posts WHERE is_published = TRUE';
  const countParams = [];
  let countParamIndex = 1;
  
  if (category) {
    countQuery += ` AND category = $${countParamIndex++}`;
    countParams.push(category);
  }
  if (featured !== null) {
    countQuery += ` AND featured = $${countParamIndex++}`;
    countParams.push(featured);
  }

  const { rows: countRows } = await pool.query(countQuery, countParams);
  
  return {
    posts: rows,
    total: parseInt(countRows[0].count, 10)
  };
};

const getBlogPostBySlug = async (slug) => {
  const query = 'SELECT id, slug, title, excerpt, category, tags, read_time as "readTime", published_at as "publishedAt", featured, cover_image as "coverImage", content, author_name as "authorName" FROM blog_posts WHERE slug = $1 AND is_published = TRUE';
  const { rows } = await pool.query(query, [slug]);
  return rows[0] || null;
};

module.exports = {
  getBlogPosts,
  getBlogPostBySlug
};
