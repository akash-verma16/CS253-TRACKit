const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lecture.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isUserInCourse, isFacultyInCourse } = require('../middleware/course.middleware');
const multer = require('multer');

// ✅ Multer File Upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify upload directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// ✅ Middleware to handle Multer errors gracefully
const uploadMiddleware = (req, res, next) => {
    upload.array('pdfFiles', 10)(req, res, (err) => { // Allow up to 10 PDF files
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }
        next();
    });
};

// ✅ Route to Get All Lectures for a Course (for users associated with the course)
router.get('/course/:courseId', [verifyToken, isUserInCourse], lectureController.getLecturesByCourse);

// ✅ Route to Create a New Lecture (faculty only, with multiple PDF uploads)
router.post(
    '/', 
    [uploadMiddleware, verifyToken, isFacultyInCourse], 
    lectureController.createLecture
);

// ✅ Route to Create a Heading (faculty only)
router.post(
    '/heading', 
    [verifyToken, isFacultyInCourse], 
    lectureController.createHeading
);

// ✅ Route to Create a Subheading (faculty only)
router.post(
    '/subheading', 
    [verifyToken, isFacultyInCourse], 
    lectureController.createSubheading
);
// ✅ Route to Edit a Subheading (faculty only)
router.put('/:courseId/subheading', [verifyToken, isFacultyInCourse], (req, res, next) => {
    console.log('Edit Subheading Route Hit:', req.params, req.body);
    next();
}, lectureController.editSubheading);

// ✅ Route to Update a Lecture (faculty only, with multiple PDF uploads)
router.put(
    '/:courseId/:id', 
    [verifyToken, isFacultyInCourse, uploadMiddleware], 
    lectureController.updateLecture
);

// ✅ Route to Delete a Lecture (faculty only)
router.delete(
    '/:courseId/:id', 
    [verifyToken, isFacultyInCourse], 
    lectureController.deleteLecture
);

module.exports = router;
