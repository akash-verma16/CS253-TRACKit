const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Base middleware for all routes - authenticate user
router.use(authMiddleware.verifyToken);

// User profile routes
router.get('/profile', (req, res) => {
  res.redirect(`/api/users/${req.userId}`);
});

router.get('/courses', (req, res) => {
  res.redirect(`/api/users/${req.userId}/courses`);
});

// Get user by ID - Protected with authorization check
router.get('/:id', userController.getUserById);

// Update user's own profile
router.put('/:id', userController.updateProfile);

// Change user's password
router.put('/:id/password', userController.changePassword);

// Get user courses - Protected with authorization check
router.get('/:id/courses', userController.getUserCourses);

module.exports = router;
