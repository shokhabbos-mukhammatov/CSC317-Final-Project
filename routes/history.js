//brainstorm: Recieve input from main.html form and test weather its sent to database
//probably needs to be edited depending on our ai integration
//follow user.js for reference in doing routes
//history not saved if notuser

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');

//controller imports
const historyController = require('../controllers/historyController');

// All routes in this file require authentication
router.use(isAuthenticated);

// POST /history/add - Add a new history entry
router.post('/add', historyController.addHistory);

module.exports = router;
