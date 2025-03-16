const db = require('../models');
const Student = db.Student;
const User = db.User;

// Get student profile by ID
exports.getStudentProfile = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findByPk(studentId, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'userType']
      }]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Some error occurred while retrieving student profile'
    });
  }
};

// Update student details
exports.updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { rollNumber, enrollmentYear, major } = req.body;

    // Check if student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update student profile
    await student.update({
      rollNumber: rollNumber || student.rollNumber,
      enrollmentYear: enrollmentYear || student.enrollmentYear,
      major: major || student.major
    });

    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Some error occurred while updating student profile'
    });
  }
};
