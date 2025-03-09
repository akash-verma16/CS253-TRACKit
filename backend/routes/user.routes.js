const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Protected routes
router.get('/profile', verifyToken, (req, res) => {
  // Redirect to user's own profile
  res.redirect(`/api/users/${req.userId}`);
});

// Get user by ID - Accessible by the user themselves or admin
router.get('/:id', verifyToken, async (req, res, next) => {
  if (req.userId == req.params.id) {
    // User is requesting their own info
    return next();
  } else {
    // Check if user is an admin
    return isAdmin(req, res, next);
  }
}, userController.getUserById);

// Admin only routes
router.get('/', [verifyToken, isAdmin], userController.getAllUsers);
router.post('/', [verifyToken, isAdmin], userController.createUser);
router.put('/:id', [verifyToken, isAdmin], userController.updateUser);
router.delete('/:id', [verifyToken, isAdmin], userController.deleteUser);

module.exports = router;
