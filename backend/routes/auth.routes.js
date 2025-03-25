const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.post('/login', authController.login);
router.post('/check-username', authController.checkUsername);

// Protected routes (Admin only)
router.post('/signup', [verifyToken, isAdmin], authController.signup);

module.exports = router;
