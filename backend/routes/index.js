const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const adminRoutes = require('./admin');
const blogRoutes = require('./blog');
const portfolioRoutes = require('./portfolio');
const contactRoutes = require('./contact');

const settingsController = require('../controllers/settingsController');
const heroController = require('../controllers/heroController');
const aboutController = require('../controllers/aboutController');
const servicesController = require('../controllers/servicesController');

// Public API Routes
router.get('/settings', settingsController.getSettings);
router.get('/hero', heroController.getHero);
router.get('/about', aboutController.getAbout);
router.get('/services', servicesController.getServices);

router.use('/blog', blogRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/contact', contactRoutes);

// Auth & Admin Routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
