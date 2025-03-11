const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Admin = db.Admin;
const Faculty = db.Faculty;
const Student = db.Student;

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Some error occurred while retrieving users'
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get specific user type information
    let specificInfo = {};
    if (user.userType === 'admin') {
      specificInfo = await Admin.findByPk(user.id);
    } else if (user.userType === 'faculty') {
      specificInfo = await Faculty.findByPk(user.id);
    } else if (user.userType === 'student') {
      specificInfo = await Student.findByPk(user.id);
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...user.dataValues,
        specificInfo: specificInfo || {}
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Some error occurred while retrieving the user'
    });
  }
};

// Create a new user (admin only)
exports.createUser = async (req, res) => {
  try {
    // Hash password
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    // Create user
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userType: req.body.userType
    });

    // Create specific user type record
    if (req.body.userType === 'admin') {
      await Admin.create({
        userId: user.id
      });
    } else if (req.body.userType === 'faculty') {
      await Faculty.create({
        userId: user.id,
        department: req.body.department,
        position: req.body.position
      });
    } else if (req.body.userType === 'student') {
      await Student.create({
        userId: user.id,
        rollNumber: req.body.rollNumber,
        enrollmentYear: req.body.enrollmentYear,
        major: req.body.major
      });
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      userId: user.id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Some error occurred while creating the user'
    });
  }
};

// Update a user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = { ...req.body };
    
    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = bcrypt.hashSync(updateData.password, 8);
    }
    
    // Don't allow changing userType directly
    delete updateData.userType;
    
    const [updated] = await User.update(updateData, {
      where: { id: userId }
    });
    
    if (updated === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Some error occurred while updating the user'
    });
  }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete specific user type record first
    if (user.userType === 'admin') {
      await Admin.destroy({ where: { userId } });
    } else if (user.userType === 'faculty') {
      await Faculty.destroy({ where: { userId } });
    } else if (user.userType === 'student') {
      await Student.destroy({ where: { userId } });
    }
    
    // Delete the user
    await user.destroy();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Some error occurred while deleting the user'
    });
  }
};

// In user.controller.js
exports.getUserCourses = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: ['id', 'userType']
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    let courses = [];
    
    if (user.userType === 'student') {
      const student = await Student.findByPk(userId, {
        include: [{
          model: db.Course,
          as: 'courses',
          through: { attributes: [] }
        }]
      });
      courses = student ? student.courses : [];
    } else if (user.userType === 'faculty') {
      const faculty = await Faculty.findByPk(userId, {
        include: [{
          model: db.Course,
          as: 'courses',
          through: { attributes: [] }
        }]
      });
      courses = faculty ? faculty.courses : [];
    }
    
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving courses'
    });
  }
};