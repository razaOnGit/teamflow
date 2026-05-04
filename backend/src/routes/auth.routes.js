const express = require('express');
const { signup, login, getMe } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateSignup, validateLogin } = require('../utils/validation');

const router = express.Router();

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', authenticateToken, getMe);

module.exports = router;