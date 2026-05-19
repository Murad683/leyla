const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

const settingsController = require('../controllers/settingsController');
const heroController = require('../controllers/heroController');
const aboutController = require('../controllers/aboutController');
const servicesController = require('../controllers/servicesController');
const blogController = require('../controllers/blogController');
const portfolioController = require('../controllers/portfolioController');
const contactController = require('../controllers/contactController');
const { upload, uploadImage } = require('../controllers/uploadController');

// All routes here are protected
router.use(verifyToken);

// Settings
router.get('/settings', settingsController.getSettings);
router.put('/settings', settingsController.updateSettings);

// Hero
router.get('/hero', heroController.getHero);
router.put('/hero', heroController.updateHero);

// About
router.get('/about', aboutController.getAbout);
router.put('/about', aboutController.updateAbout);

// Services
router.post('/services', servicesController.createService);
router.put('/services/:id', servicesController.updateService);
router.delete('/services/:id', servicesController.deleteService);

// Blog
router.post('/blog', blogController.createBlogPost);
router.put('/blog/:id', blogController.updateBlogPost);
router.delete('/blog/:id', blogController.deleteBlogPost);

// Portfolio
router.post('/portfolio', portfolioController.createPortfolioItem);
router.put('/portfolio/:id', portfolioController.updatePortfolioItem);
router.delete('/portfolio/:id', portfolioController.deletePortfolioItem);

// Contacts
router.get('/contacts', contactController.getContacts);
router.put('/contacts/:id/read', contactController.markContactAsRead);

// Uploads
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
