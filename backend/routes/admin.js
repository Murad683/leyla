const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

const settingsController = require('../controllers/settingsController');
const heroController = require('../controllers/heroController');
const servicesController = require('../controllers/servicesController');
const homeController = require('../controllers/homeController');
const coursesController = require('../controllers/coursesController');
const testimonialsController = require('../controllers/testimonialsController');
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

// Home content (Intro / Numbers / Process / course furniture)
router.get('/home', homeController.getHome);
router.put('/home', homeController.updateHome);

// Services
router.post('/services', servicesController.createService);
router.put('/services/:id', servicesController.updateService);
router.delete('/services/:id', servicesController.deleteService);

// Courses
router.post('/courses', coursesController.createCourse);
router.put('/courses/:id', coursesController.updateCourse);
router.delete('/courses/:id', coursesController.deleteCourse);

// Testimonials
router.post('/testimonials', testimonialsController.createTestimonial);
router.put('/testimonials/:id', testimonialsController.updateTestimonial);
router.delete('/testimonials/:id', testimonialsController.deleteTestimonial);

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
