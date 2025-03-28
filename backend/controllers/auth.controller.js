const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const Admin = db.Admin;
const Faculty = db.Faculty;
const Student = db.Student;

exports.signup = async (req, res) => {
  // Only admins can create users, this is just for structure
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
        userId: user.id,
        //adminLevel: req.body.adminLevel || 1
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
      message: 'User registered successfully',
      userId: user.id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Some error occurred during registration'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    
    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Fetch additional user-specific data based on user type
    let additionalData = {};

    if (user.userType === 'student') {
      const student = await Student.findOne({ where: { userId: user.id } });
      if (student) {
        additionalData = {
          rollNumber: student.rollNumber,
          enrollmentYear: student.enrollmentYear,
          major: student.major
        };
      }
    } else if (user.userType === 'faculty') {
      const faculty = await Faculty.findOne({ where: { userId: user.id } });
      if (faculty) {
        additionalData = {
          department: faculty.department,
          position: faculty.position
        };
      }
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, userType: user.userType }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        ...additionalData  // Include the user-specific data
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Some error occurred during login'
    });
  }
};

exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.body;

    // Find user
    const user = await User.findOne({ 
      where: { username },
      attributes: ['id', 'email'] // Only fetch necessary fields
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No such user exists'
      });
    }

    // User exists, send success response
    return res.status(200).json({
      success: true,
      message: 'User found',
      userId: user.id,
      email: user.email
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking username'
    });
  }
};
