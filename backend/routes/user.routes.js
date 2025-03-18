const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Protected routes
router.get('/profile', verifyToken, (req, res) => {
  res.redirect(`/api/users/${req.userId}`);
});

router.get('/courses', verifyToken, (req, res) => {
  res.redirect(`/api/users/${req.userId}/courses`);
});

// Get user by ID - Accessible by the user themselves
router.get('/:id', verifyToken, userController.getUserById);

// Get user courses - Accessible by the user themselves
router.get('/:id/courses', verifyToken, userController.getUserCourses);

module.exports = router;
