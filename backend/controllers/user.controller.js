const bcrypt = require('bcryptjs');
const db = require('../models');
const { parse } = require('csv-parse/sync'); // Update this line
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
    // Authorization check: Users can only view themselves unless they're admins
    if (req.userId != req.params.id && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own profile'
      });
    }
    
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
      specificInfo = await Admin.findOne({ where: { userId: user.id } });
    } else if (user.userType === 'faculty') {
      specificInfo = await Faculty.findOne({ where: { userId: user.id } });
    } else if (user.userType === 'student') {
      specificInfo = await Student.findOne({ where: { userId: user.id } });
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
  const t = await db.sequelize.transaction();
  
  try {
    // Validate required fields
    const requiredFields = ['username', 'email', 'password', 'firstName', 'userType'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Additional validation for student-specific fields
    if (req.body.userType === 'student') {
      const studentFields = ['rollNumber', 'enrollmentYear', 'major'];
      const missingStudentFields = studentFields.filter(field => !req.body[field]);
      
      if (missingStudentFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required student fields: ${missingStudentFields.join(', ')}`
        });
      }

      // Validate enrollment year
      if (isNaN(req.body.enrollmentYear) || req.body.enrollmentYear < 2000 || req.body.enrollmentYear > 2099) {
        return res.status(400).json({
          success: false,
          message: 'Invalid enrollment year'
        });
      }
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { username: req.body.username },
          { email: req.body.email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    // Rest of the existing createUser code...
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userType: req.body.userType
    }, { transaction: t });

    if (req.body.userType === 'student') {
      await Student.create({
        userId: user.id,
        rollNumber: req.body.rollNumber,
        enrollmentYear: parseInt(req.body.enrollmentYear),
        major: req.body.major
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      userId: user.id
    });
  } catch (error) {
    await t.rollback();
    // Improve error message handling
    let errorMessage = 'Some error occurred while creating the user';
    if (error.name === 'SequelizeValidationError') {
      errorMessage = error.errors.map(e => e.message).join(', ');
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      errorMessage = 'Username or email already exists';
    }
    
    res.status(400).json({
      success: false,
      message: errorMessage
    });
  }
};

// Bulk create students from CSV
exports.bulkCreateStudents = async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a CSV file'
    });
  }

  const t = await db.sequelize.transaction();
  
  try {
    const csvData = req.files.file.data.toString('utf8');
    const records = parse(csvData, {  // Update this line
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const requiredColumns = ['username', 'email', 'password', 'firstName', 'lastName', 
                           'rollNumber', 'enrollmentYear', 'major'];
    const firstRecord = records[0];
    const missingColumns = requiredColumns.filter(col => !(col in firstRecord));

    if (missingColumns.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required columns in CSV: ${missingColumns.join(', ')}`
      });
    }

    const createdUsers = [];
    const errors = [];

    for (const [index, record] of records.entries()) {
      try {
        // Basic validation
        if (!record.username || !record.email || !record.password || !record.firstName || 
            !record.rollNumber || !record.enrollmentYear || !record.major) {
          throw new Error('Missing required fields');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(record.email)) {
          throw new Error('Invalid email format');
        }

        // Username validation
        if (record.username.length < 3 || record.username.length > 50) {
          throw new Error('Username must be between 3 and 50 characters');
        }

        // Enrollment year validation
        const enrollmentYear = parseInt(record.enrollmentYear);
        if (isNaN(enrollmentYear) || enrollmentYear < 2000 || enrollmentYear > 2099) {
          throw new Error('Invalid enrollment year (must be between 2000 and 2099)');
        }

        // Check for existing username or email
        const existingUser = await User.findOne({
          where: {
            [db.Sequelize.Op.or]: [
              { username: record.username },
              { email: record.email }
            ]
          }
        });

        if (existingUser) {
          throw new Error('Username or email already exists');
        }

        // Check for existing roll number
        const existingStudent = await Student.findOne({
          where: { rollNumber: record.rollNumber }
        });

        if (existingStudent) {
          throw new Error('Roll number already exists');
        }

        const hashedPassword = bcrypt.hashSync(record.password, 8);
        
        const user = await User.create({
          username: record.username,
          email: record.email,
          password: hashedPassword,
          firstName: record.firstName,
          lastName: record.lastName || null,
          userType: 'student'
        }, { transaction: t });

        await Student.create({
          userId: user.id,
          rollNumber: record.rollNumber,
          enrollmentYear: enrollmentYear,
          major: record.major
        }, { transaction: t });

        createdUsers.push(user.id);
      } catch (error) {
        errors.push(`Row ${index + 1}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Errors occurred while processing CSV',
        errors: errors
      });
    }

    await t.commit();
    res.status(201).json({
      success: true,
      message: `Successfully created ${createdUsers.length} students`,
      userIds: createdUsers
    });
  } catch (error) {
    await t.rollback();
    res.status(400).json({
      success: false,
      message: error.message || 'Error processing CSV file'
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
    // Authorization check: Users can only view their own courses unless they're admins
    if (req.userId != req.params.id && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own courses'
      });
    }
    
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