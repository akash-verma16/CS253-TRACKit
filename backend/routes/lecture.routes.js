const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lecture.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isUserInCourse, isFacultyInCourse } = require('../middleware/course.middleware');
const multer = require('multer');
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory for uploaded files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
// Get all lectures for a course (users associated with course)
router.get('/course/:courseId', [verifyToken, isUserInCourse], lectureController.getLecturesByCourse);

// Create a new lecture (faculty only, with optional PDF upload)
router.post('/', [verifyToken, isFacultyInCourse, upload.single('pdfFile')], lectureController.createLecture);

// Update a lecture (faculty only, with optional PDF upload)
router.put('/:courseId/:id', [verifyToken, isFacultyInCourse, upload.single('pdfFile')], lectureController.updateLecture);

// Delete a lecture (faculty only)
router.delete('/:courseId/:id', [verifyToken, isFacultyInCourse], lectureController.deleteLecture);

module.exports = router;