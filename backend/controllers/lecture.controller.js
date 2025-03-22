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
      order: [['createdAt', 'ASC']] // Order by oldest first
    });

    const lecturesWithPdfUrls = lectures.map(lecture => ({
      ...lecture.dataValues,
      pdfUrls: JSON.parse(lecture.pdfPaths || '[]').map(pdfPath => `${req.protocol}://${req.get('host')}/${pdfPath}`)
    }));

    res.status(200).json({
      success: true,
      data: lecturesWithPdfUrls
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

    const lectureWithPdfUrls = {
      ...lecture.dataValues,
      pdfUrls: JSON.parse(lecture.pdfPaths || '[]').map(pdfPath => `${req.protocol}://${req.get('host')}/${pdfPath}`)
    };

    res.status(200).json({
      success: true,
      data: lectureWithPdfUrls
    });
  } catch (error) {
    console.error('Error fetching lecture:', error);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while retrieving the lecture'
    });
  }
};

// Create a new lecture with multiple PDF uploads
exports.createLecture = async (req, res) => {
  try {
    const { courseId, heading, subheading, lectureTitle, lectureDescription, youtubeLink } = req.body;
    const pdfPaths = req.files ? req.files.map(file => path.join('uploads', file.filename)) : [];

    const lecture = await Lecture.create({
      courseId,
      heading,
      subheading,
      lectureTitle,
      lectureDescription,
      youtubeLink,
      pdfPaths: JSON.stringify(pdfPaths) // Store as JSON string
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

// Create a new heading with an optional subheading
exports.createHeading = async (req, res) => {
  try {
    const { courseId, heading, subheading } = req.body;

    if (!courseId || !heading || !subheading) {
      return res.status(400).json({
        success: false,
        message: 'Course ID, heading, and subheading are required'
      });
    }

    // Create the heading
    const newHeading = await Lecture.create({
      courseId,
      heading,
      subheading, // Subheading is now required
      lectureTitle: null,
      lectureDescription: null,
      pdfPath: null
    });

    res.status(201).json({
      success: true,
      message: 'Heading created successfully',
      data: newHeading
    });
  } catch (error) {
    console.error('Error creating heading:', error);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while creating the heading'
    });
  }
};

// Create a new subheading
exports.createSubheading = async (req, res) => {
  try {
    const { courseId, heading, subheading } = req.body;

    if (!courseId || !heading || !subheading) {
      return res.status(400).json({
        success: false,
        message: 'Course ID, heading, and subheading are required'
      });
    }

    const newSubheading = await Lecture.create({
      courseId,
      heading,
      subheading,
      lectureTitle: null,
      lectureDescription: null,
      pdfPath: null
    });

    res.status(201).json({
      success: true,
      message: 'Subheading created successfully',
      data: newSubheading
    });
  } catch (error) {
    console.error('Error creating subheading:', error);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while creating the subheading'
    });
  }
};

// Edit a subheading
exports.editSubheading = async (req, res) => {
  console.log('Edit Subheading Request Received:', req.body);
  try {
    const { courseId } = req.params;
    const { currentSubheading, newSubheading, heading } = req.body;

    if (!currentSubheading || !newSubheading || !heading) {
      return res.status(400).json({
        success: false,
        message: 'Current subheading, new subheading, and heading are required'
      });
    }

    const lectures = await Lecture.findAll({
      where: { courseId, subheading: currentSubheading, heading }
    });

    if (!lectures || lectures.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No lectures found with the specified heading and subheading'
      });
    }

    // Update all matching lectures
    const updatePromises = lectures.map(lecture => 
      lecture.update({ subheading: newSubheading })
    );
    
    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: `Updated subheading for ${lectures.length} lectures`,
      count: lectures.length
    });
  } catch (error) {
    console.error('Error updating subheading:', error);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while updating the subheading'
    });
  }
};

// Update a lecture with multiple PDF uploads
exports.updateLecture = async (req, res) => {
  try {
    const { id: lectureId, courseId } = req.params;
    const { heading, subheading, lectureTitle, lectureDescription, youtubeLink } = req.body;
    const newPdfPaths = req.files ? req.files.map(file => path.join('uploads', file.filename)) : [];

    const lecture = await Lecture.findOne({
      where: { id: lectureId, courseId }
    });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    const existingPdfPaths = JSON.parse(lecture.pdfPaths || '[]');
    const updatedPdfPaths = [...existingPdfPaths, ...newPdfPaths];

    console.log('YouTube Link:', youtubeLink);
    await lecture.update({
      heading: heading || lecture.heading,
      subheading: subheading || lecture.subheading,
      lectureTitle: lectureTitle || lecture.lectureTitle,
      lectureDescription: lectureDescription || lecture.lectureDescription,
      youtubeLink: youtubeLink === null ? '' : youtubeLink || '',
      pdfPaths: JSON.stringify(updatedPdfPaths)
    });

    res.status(200).json({
      success: true,
      message: 'Lecture updated successfully',
      data: lecture
    });
  } catch (error) {
    console.error('Error updating lecture:', error);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while updating the lecture'
    });
  }
};

// Delete a lecture and its associated PDFs
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

    const pdfPaths = JSON.parse(lecture.pdfPaths || '[]');
    pdfPaths.forEach(filePath => {
      const absolutePath = path.resolve(filePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    });

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