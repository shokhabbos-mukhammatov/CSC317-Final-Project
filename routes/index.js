/**
 * Index routes
 * Handles public routes that don't require authentication
 * Includes homepage, about page, and itinerary generation form
 */

const express = require('express');
const router = express.Router();

// Import controller for GPT-based itinerary generation
const aiController = require('../controllers/aiController');

// GET / - Render homepage
// Displays welcome message, trip planning form, and optionally the AI-generated result
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    message: 'Welcome to the Authentication Template'
  });
});

// GET /about - Static about page
// Describes the purpose and technology stack of the app
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    message: 'Learn about this application'
  });
});

// POST /generate-itinerary - Handle form submission from homepage
// Sends user input to GPT-4.1 and renders the itinerary result
router.post('/generate-itinerary', aiController.generateItinerary);

// Export this router to be used in app.js
module.exports = router;
