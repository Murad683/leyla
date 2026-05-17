const blogQueries = require('../services/db/blogQueries');

const getBlogPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const category = req.query.category || null;
    const featured = req.query.featured ? req.query.featured === 'true' : null;

    const offset = (page - 1) * limit;

    const { posts, total } = await blogQueries.getBlogPosts(limit, offset, category, featured);
    
    // Map author structure correctly
    const formattedPosts = posts.map(p => ({
      ...p,
      author: { name: p.authorName, avatar: null }
    }));

    res.json({
      success: true,
      data: {
        posts: formattedPosts,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getBlogPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await blogQueries.getBlogPostBySlug(slug);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const formattedPost = {
      ...post,
      author: { name: post.authorName, avatar: null }
    };

    res.json({ success: true, data: formattedPost });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogPosts,
  getBlogPostBySlug
};
