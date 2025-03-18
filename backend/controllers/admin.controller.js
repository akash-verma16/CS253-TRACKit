const db = require('../models');
const bcrypt = require('bcryptjs');
const { parse } = require('csv-parse/sync');
const User = db.User;
const Admin = db.Admin;
const Faculty = db.Faculty;
const Student = db.Student;
const Course = db.Course;

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

// Add student
exports.addStudent = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    // Validate required fields
    const requiredFields = ['username', 'email', 'password', 'firstName'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Additional validation for student-specific fields
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

    // Check for existing roll number
    const existingStudent = await Student.findOne({
      where: { rollNumber: req.body.rollNumber }
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Roll number already exists'
      });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userType: 'student'
    }, { transaction: t });

    await Student.create({
      userId: user.id,
      rollNumber: req.body.rollNumber,
      enrollmentYear: parseInt(req.body.enrollmentYear),
      major: req.body.major
    }, { transaction: t });

    await t.commit();
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      userId: user.id
    });
  } catch (error) {
    await t.rollback();
    
    // Better error handling
    let errorMessage = 'Error creating student';
    if (error.name === 'SequelizeValidationError') {
      errorMessage = error.errors.map(e => e.message).join(', ');
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      errorMessage = 'Username, email or roll number already exists';
    }
    
    res.status(400).json({
      success: false,
      message: errorMessage
    });
  }
};

// Add faculty
exports.addFaculty = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    // Validate required fields
    const requiredFields = ['username', 'email', 'password', 'firstName', 'department', 'position'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
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
    
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName || '',
      userType: 'faculty'
    }, { transaction: t });

    await Faculty.create({
      userId: user.id,
      department: req.body.department,
      position: req.body.position
    }, { transaction: t });

    await t.commit();
    res.status(201).json({
      success: true,
      message: 'Faculty created successfully',
      userId: user.id
    });
  } catch (error) {
    await t.rollback();
    let errorMessage = 'Error creating faculty';
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

// Create a generic user (admin only)
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
    } else if (req.body.userType === 'faculty') {
      await Faculty.create({
        userId: user.id,
        department: req.body.department || '',
        position: req.body.position || ''
      }, { transaction: t });
    } else if (req.body.userType === 'admin') {
      await Admin.create({
        userId: user.id
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
    const records = parse(csvData, {  
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const requiredColumns = ['username', 'email', 'password', 'firstName', 'lastName', 
                           'rollNumber', 'enrollmentYear', 'major'];
    
    if (records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'CSV file is empty'
      });
    }
    
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

// Bulk create faculty from CSV
exports.bulkCreateFaculty = async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a CSV file'
    });
  }

  const t = await db.sequelize.transaction();
  
  try {
    const csvData = req.files.file.data.toString('utf8');
    const records = parse(csvData, {  
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const requiredColumns = ['username', 'email', 'password', 'firstName', 'lastName', 
                           'department', 'position'];
    
    if (records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'CSV file is empty'
      });
    }
    
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
            !record.department || !record.position) {
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

        const hashedPassword = bcrypt.hashSync(record.password, 8);
        
        const user = await User.create({
          username: record.username,
          email: record.email,
          password: hashedPassword,
          firstName: record.firstName,
          lastName: record.lastName || '',
          userType: 'faculty'
        }, { transaction: t });

        await Faculty.create({
          userId: user.id,
          department: record.department,
          position: record.position
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
      message: `Successfully created ${createdUsers.length} faculty members`,
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

// Update user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = { ...req.body };
    
    if (updateData.password) {
      updateData.password = bcrypt.hashSync(updateData.password, 8);
    }
    
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
      message: error.message || 'Error updating user'
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.destroy();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting user'
    });
  }
};

// Course management functions
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      courseId: course.id
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating course'
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
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

exports.updateCourse = async (req, res) => {
  try {
    const [updated] = await Course.update(req.body, {
      where: { id: req.params.courseId }
    });
    
    if (updated === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Course updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating course'
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.destroy({
      where: { id: req.params.courseId }
    });
    
    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting course'
    });
  }
};

// Helper function to verify user addition and database persistence
exports.testDBPersistence = async (req, res) => {
  try {
    // Count total users
    const userCount = await User.count();
    
    // Get basic DB stats
    const dbStats = {
      totalUsers: userCount,
      students: await Student.count(),
      faculty: await Faculty.count(),
      admins: await Admin.count(),
      courses: await Course.count()
    };
    
    res.status(200).json({
      success: true,
      message: 'Database connection test successful',
      persistenceEnabled: process.env.FORCE_SYNC !== 'true',
      stats: dbStats,
      note: process.env.FORCE_SYNC === 'true' ? 
        'WARNING: Database is configured to reset on server restart!' : 
        'Database persistence is enabled'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection test failed',
      error: error.message
    });
  }
};
