const db = require('../models');
const Lecture = db.Lecture;
const path = require('path');
const fs = require('fs');

// Get all lectures for a specific course
exports.getLecturesByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const lectures = await Lecture.findAll({
      where: { courseId },
      order: [['week', 'ASC'], ['createdAt', 'DESC']] // Order by week, then most recent
    });

    // Add full URL for the PDF file
    const lecturesWithPdfUrl = lectures.map(lecture => ({
      ...lecture.dataValues,
      pdfUrl: lecture.pdfPath ? `${req.protocol}://${req.get('host')}/${lecture.pdfPath}` : null
    }));

    res.status(200).json({
      success: true,
      data: lecturesWithPdfUrl
    });
  } catch (error) {
    console.error('Error fetching lectures:', error);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while retrieving lectures'
    });
  }
};

// Get a specific lecture
exports.getLecture = async (req, res) => {
  try {
    const { id: lectureId, courseId } = req.params;

    const lecture = await Lecture.findOne({
      where: { id: lectureId, courseId }
    });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Add full URL for the PDF file
    const lectureWithPdfUrl = {
      ...lecture.dataValues,
      pdfUrl: lecture.pdfPath ? `${req.protocol}://${req.get('host')}/${lecture.pdfPath}` : null
    };

    res.status(200).json({
      success: true,
      data: lectureWithPdfUrl
    });
  } catch (error) {
    console.error('Error fetching lecture:', error);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while retrieving the lecture'
    });
  }
};

// Create a new lecture with optional PDF upload
exports.createLecture = async (req, res) => {
  try {
    const { courseId, week, topicTitle, lectureTitle, lectureDescription } = req.body;
    let pdfPath = null;
    
    if (req.file) {
      pdfPath = path.join('uploads', req.file.filename);
    }

    const lecture = await Lecture.create({
      courseId,
      week,
      topicTitle,
      lectureTitle,
      lectureDescription,
      pdfPath
    });

    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      data: lecture
    });
  } catch (error) {
    console.error('Error creating lecture:', error);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while creating the lecture'
    });
  }
};

// Update a lecture with optional PDF upload
exports.updateLecture = async (req, res) => {
    try {
      const { id: lectureId, courseId } = req.params;
      const { week, topicTitle, lectureTitle, lectureDescription } = req.body;
      let pdfPath = null;
  
    console.log('Checking for uploaded file:', req.file);
    if (req.file) {
      pdfPath = path.join('uploads', req.file.filename);
      console.log('PDF file path set to:', pdfPath);
    } else {
      console.log('No file uploaded');
    }
  
    console.log('Incoming update request:', {
      lectureId,
      courseId,
      week,
      topicTitle,
      lectureTitle,
      lectureDescription
    });

    const lecture = await Lecture.findOne({
      where: { id: lectureId, courseId }
    });

    if (!lecture) {
      console.log(`Lecture with ID ${lectureId} not found in course ${courseId}`);
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    console.log('Lecture found:', lecture.dataValues);

    // Update lecture
    await lecture.update({
      week: week || lecture.week,
      topicTitle: topicTitle || lecture.topicTitle,
      lectureTitle: lectureTitle || lecture.lectureTitle,
      lectureDescription: lectureDescription || lecture.lectureDescription,
      pdfPath: pdfPath || lecture.pdfPath,
      updatedAt: new Date()
    });
    console.log('PDF path after update:', pdfPath);
    if (req.file) {
      console.log('PDF file received:', req.file.filename);
    } else {
      console.log('No PDF file received');
    }
    console.log('Lecture successfully updated:', {
      lectureId,
      courseId,
      updatedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Lecture updated successfully',
      data: {
        ...lecture.dataValues,
        pdfUrl: lecture.pdfPath ? `${req.protocol}://${req.get('host')}/${lecture.pdfPath}` : null
      }
    });
  } catch (error) {
    console.error('Error updating lecture:', error);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while updating the lecture',
      error: error.message
    });
  }
};

// Delete a lecture and its associated PDF
exports.deleteLecture = async (req, res) => {
  try {
    const { id: lectureId, courseId } = req.params;

    const lecture = await Lecture.findOne({
      where: { id: lectureId, courseId }
    });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    if (lecture.pdfPath) {
      const filePath = path.resolve(lecture.pdfPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await lecture.destroy();

    res.status(200).json({
      success: true,
      message: 'Lecture deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lecture:', error);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while deleting the lecture'
    });
  }
};
