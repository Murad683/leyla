const prisma = require('../config/prisma');

const getBlogPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const category = req.query.category || undefined;
    const featured = req.query.featured === 'true' ? true : undefined;

    const skip = (page - 1) * limit;

    const where = {
      isPublished: true,
      ...(category && { category }),
      ...(featured !== undefined && { featured })
    };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' }
      }),
      prisma.blogPost.count({ where })
    ]);

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
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (!post || !post.isPublished) {
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

// Admin CRUD
const createBlogPost = async (req, res, next) => {
  try {
    const post = await prisma.blogPost.create({ data: req.body });
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

const updateBlogPost = async (req, res, next) => {
  try {
    const post = await prisma.blogPost.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

const deleteBlogPost = async (req, res, next) => {
  try {
    await prisma.blogPost.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
};
