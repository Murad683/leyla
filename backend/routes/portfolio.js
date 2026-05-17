const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

/**
 * @openapi
 * /portfolio:
 *   get:
 *     summary: Get all portfolio items
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: List of portfolio items
 */
router.get('/', portfolioController.getPortfolioItems);

/**
 * @openapi
 * /portfolio/{slug}:
 *   get:
 *     summary: Get a portfolio item by slug
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Portfolio item details
 *       404:
 *         description: Item not found
 */
router.get('/:slug', portfolioController.getPortfolioItemBySlug);

module.exports = router;
