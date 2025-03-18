const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authJwt } = require('../middleware');

// Middleware to verify admin access
router.use([authJwt.verifyToken, authJwt.isAdmin]);

// User management routes
router.post('/student', adminController.addStudent);
router.post('/faculty', adminController.addFaculty);
router.post('/bulk-students', adminController.bulkCreateStudents); // Add this
router.get('/users', adminController.getAllUsers);
router.put('/user/:userId', adminController.updateUser);
router.delete('/user/:userId', adminController.deleteUser);

// Course management routes
router.post('/course', adminController.createCourse);
router.get('/courses', adminController.getAllCourses);
router.put('/course/:courseId', adminController.updateCourse);
router.delete('/course/:courseId', adminController.deleteCourse);

module.exports = router;
