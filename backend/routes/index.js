const express = require('express');
const router = express.Router();

const blogRoutes = require('./blog');
const portfolioRoutes = require('./portfolio');
const contactRoutes = require('./contact');

router.use('/blog', blogRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/contact', contactRoutes);

module.exports = router;
