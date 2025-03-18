const db = require('../models');
const User = db.User;
const Admin = db.Admin;
const Course = db.Course;
const { Op } = require('sequelize');

const adminController = {
  // Add new student
  async addStudent(req, res) {
    try {
      const { username, email, password, firstName, lastName } = req.body;
      const user = await User.create({
        username,
        email,
        password: bcrypt.hashSync(password, 8),
        firstName,
        lastName,
        userType: 'student'
      });
      return res.status(201).json({ message: 'Student created successfully', user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Add new faculty
  async addFaculty(req, res) {
    try {
      const { username, email, password, firstName, lastName } = req.body;
      const user = await User.create({
        username,
        email,
        password: bcrypt.hashSync(password, 8),
        firstName,
        lastName,
        userType: 'faculty'
      });
      return res.status(201).json({ message: 'Faculty created successfully', user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Create new course
  async createCourse(req, res) {
    try {
      const { courseName, courseCode, description, facultyId } = req.body;
      const course = await Course.create({
        courseName,
        courseCode,
        description,
        facultyId
      });
      return res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Get all courses
  async getAllCourses(req, res) {
    try {
      const courses = await Course.findAll({
        include: [{
          model: User,
          as: 'faculty',
          attributes: ['firstName', 'lastName']
        }]
      });
      return res.status(200).json(courses);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        where: {
          userType: {
            [Op.ne]: 'admin'
          }
        },
        attributes: { exclude: ['password'] }
      });
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      await User.destroy({
        where: { id: userId }
      });
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports = adminController;
