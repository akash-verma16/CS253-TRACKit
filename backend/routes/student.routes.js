const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Get student profile - Accessible by the student themselves or admin
router.get('/:id/profile', verifyToken, async (req, res, next) => {
  if (req.userId == req.params.id) {
    // Student is requesting their own profile
    return next();
  } else {
    // Check if user is an admin
    return isAdmin(req, res, next);
  }
}, studentController.getStudentProfile);

// Update student profile - Accessible by the student themselves or admin
// router.put('/:id/profile', verifyToken, async (req, res, next) => {
//   if (req.userId == req.params.id) {
//     // Student is updating their own profile
//     return next();
//   } else {
//     // Check if user is an admin
//     return isAdmin(req, res, next);
//   }
// }, studentController.updateStudentProfile);

module.exports = router;
