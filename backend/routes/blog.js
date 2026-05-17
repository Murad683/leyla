const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

/**
 * @openapi
 * /blog:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of blog posts
 */
router.get('/', blogController.getBlogPosts);

/**
 * @openapi
 * /blog/{slug}:
 *   get:
 *     summary: Get a blog post by slug
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post details
 *       404:
 *         description: Post not found
 */
router.get('/:slug', blogController.getBlogPostBySlug);

module.exports = router;
