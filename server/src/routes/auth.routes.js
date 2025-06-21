const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');

// Register a new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Check if token is valid
router.get('/check-token', authenticate, authController.checkToken);

module.exports = router;
