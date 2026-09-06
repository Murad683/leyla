const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const adminRoutes = require('./admin');
const portfolioRoutes = require('./portfolio');
const contactRoutes = require('./contact');

const settingsController = require('../controllers/settingsController');
const heroController = require('../controllers/heroController');
const servicesController = require('../controllers/servicesController');
const homeController = require('../controllers/homeController');
const coursesController = require('../controllers/coursesController');
const testimonialsController = require('../controllers/testimonialsController');

// Public API Routes
router.get('/settings', settingsController.getSettings);
router.get('/hero', heroController.getHero);
router.get('/home', homeController.getHome);
router.get('/services', servicesController.getServices);
router.get('/courses', coursesController.getCourses);
router.get('/testimonials', testimonialsController.getTestimonials);

router.use('/portfolio', portfolioRoutes);
router.use('/contact', contactRoutes);

// Auth & Admin Routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
