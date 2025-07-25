const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware to verify admin access for all routes in this file
router.use([authMiddleware.verifyToken, authMiddleware.isAdmin]);

// User management routes
router.post('/student', adminController.addStudent);
router.post('/faculty', adminController.addFaculty);
router.post('/bulk-faculty', adminController.bulkCreateFaculty); // Add bulk faculty endpoint
router.post('/user', adminController.createUser);
router.post('/bulk-students', adminController.bulkCreateStudents);
router.get('/users', adminController.getAllUsers);
router.put('/user/:userId', adminController.updateUser);
router.delete('/user/:userId', adminController.deleteUser);

// Course management routes
router.post('/course', adminController.createCourse);
router.post('/bulk-courses', adminController.bulkCreateCourses);
router.get('/courses', adminController.getAllCourses);
router.put('/course/:courseId', adminController.updateCourse);
router.delete('/course/:courseId', adminController.deleteCourse);

// Add a test endpoint to check database connectivity and persistence
router.get('/test-db', adminController.testDBPersistence);

module.exports = router;
