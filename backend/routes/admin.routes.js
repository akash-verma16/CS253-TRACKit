const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware to verify admin access for all routes in this file
router.use([authMiddleware.verifyToken, authMiddleware.isAdmin]);

// User management routes
router.post('/student', adminController.addStudent);
router.post('/faculty', adminController.addFaculty);
router.post('/bulk-students', adminController.bulkCreateStudents);
router.post('/user', userController.createUser); // Move from user routes to admin
router.get('/users', adminController.getAllUsers);
router.put('/user/:userId', adminController.updateUser);
router.delete('/user/:userId', adminController.deleteUser);

// Course management routes
router.post('/course', adminController.createCourse);
router.get('/courses', adminController.getAllCourses); // Admin view of all courses
router.put('/course/:courseId', adminController.updateCourse);
router.delete('/course/:courseId', adminController.deleteCourse);

module.exports = router;
