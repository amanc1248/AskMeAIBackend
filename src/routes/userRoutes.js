const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getUsers);

// Create a new user
router.post('/', userController.createUser);

// Get user by ID
router.get('/:id', userController.getUserById);

module.exports = router; 