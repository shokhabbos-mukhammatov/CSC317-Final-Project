/**
 * Index routes
 * Handles public routes that don't require authentication
 * Includes homepage, about page, and itinerary generation form
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const aiController = require('../controllers/aiController');

// Validation middleware for /generate-itinerary
const itineraryValidation = [
  body('destination')
      .trim()
      .notEmpty().withMessage('Destination is required')
      .matches(/^[a-zA-Z\s]+$/).withMessage('Destination must only contain letters and spaces')
      .isLength({ max: 50 }).withMessage('Destination must be 50 characters or less'),
  body('days')
      .notEmpty().withMessage('Number of days is required')
      .isInt({ min: 1, max: 30 }).withMessage('Days must be between 1 and 30'),
  body('startDate')
      .notEmpty().withMessage('Start date is required')
      .isISO8601().withMessage('Start date must be a valid date'),
  body('endDate')
      .notEmpty().withMessage('End date is required')
      .isISO8601().withMessage('End date must be a valid date'),
  body('budget')
      .notEmpty().withMessage('Budget is required')
      .isInt({ min: 1, max: 100000 }).withMessage('Budget must be a reasonable number'),
  body('preferences')
      .trim()
      .notEmpty().withMessage('Preferences are required')
      .isLength({ min: 10, max: 500 }).withMessage('Preferences must be 10–500 characters')
];

// GET / - Homepage route
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    message: 'Welcome to the Trip Tuner!',
  });
});

// GET /about - About route
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    message: 'Hello from the Trip Tuner team!',
  });
});

// POST /generate-itinerary - Trip planning form submission
// Validates input then triggers GPT-powered itinerary generator
router.post('/generate-itinerary', itineraryValidation, aiController.generateItinerary);

module.exports = router;
