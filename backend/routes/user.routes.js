const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Protected routes
router.get('/profile', verifyToken, (req, res) => {//http://localhost:3000/api/users/profile
  // Redirect to user's own profile, after verifying the token.
  res.redirect(`/api/users/${req.userId}`);
});

router.get('/courses', verifyToken, (req, res) => {//http://localhost:3000/api/users/courses 
  // Redirect to user's own courses, after verifying the token.
  res.redirect(`/api/users/${req.userId}/courses`);
});

//THE FOLLOWING ID is not the username, but the dadabase id.
// Get user by ID - Accessible by the user themselves or admin 
router.get('/:id', verifyToken, async (req, res, next) => {
  ///console.log(`req.userId: ${req.userId}, req.params.id: ${req.params.id}`);
  if (req.userId == req.params.id) {
    return next();
    // User is requesting their own info
    
  } else {
    // Check if user is an admin
    return isAdmin(req, res, next);
  }
}, userController.getUserById);

// Get user courses - Accessible by the user themselves or admin
router.get('/:id/courses', verifyToken, async (req, res, next) => {
  //console.log(`req.userId: ${req.userId}, req.params.id: ${req.params.id}`);
  if (req.userId == req.params.id) {
    // User is requesting their own courses
    return next();
  } else {
    // Check if user is an admin
    return isAdmin(req, res, next);
  }
}, userController.getUserCourses);

// Admin only routes
router.get('/', [verifyToken, isAdmin], userController.getAllUsers);
router.post('/', [verifyToken, isAdmin], userController.createUser);
router.put('/:id', [verifyToken, isAdmin], userController.updateUser);
router.delete('/:id', [verifyToken, isAdmin], userController.deleteUser);

module.exports = router;
