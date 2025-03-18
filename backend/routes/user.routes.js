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

// Get user by ID - Protected with additional authorization check
router.get('/:id', userController.getUserById);

// Get user courses - Protected with additional authorization check
router.get('/:id/courses', userController.getUserCourses);

// Note: User creation route has been moved to admin routes

module.exports = router;
