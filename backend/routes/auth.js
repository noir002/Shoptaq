const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register a new admin or manager user
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Authenticate credentials and return JWT token
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Retrieve details of current authenticated user session
router.get('/me', protect, getMe);

module.exports = router;
