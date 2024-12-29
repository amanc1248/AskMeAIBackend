const express = require('express');
const router = express.Router();
const personalDataController = require('../controllers/personalDataController');

// Add personal data
router.post('/', personalDataController.addPersonalData);

// Get all personal data for a user
router.get('/user/:userId', personalDataController.getPersonalData);

// Ask question using shareable link
router.post('/ask/:shareableLink', personalDataController.askQuestion);

module.exports = router; 