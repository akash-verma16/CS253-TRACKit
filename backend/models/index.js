const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(
  dbConfig.database,
  null,
  null,
  {
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
    logging: dbConfig.logging,
    pool: dbConfig.pool
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user.model')(sequelize, Sequelize);
db.Admin = require('./admin.model')(sequelize, Sequelize);
db.Faculty = require('./faculty.model')(sequelize, Sequelize);
db.Student = require('./student.model')(sequelize, Sequelize);
db.Course = require('./course.model')(sequelize, Sequelize);

// Setup relationships
db.Course.belongsToMany(db.Faculty, { 
  through: 'course_faculty',
  as: 'faculty',
  foreignKey: 'courseId'
});

db.Faculty.belongsToMany(db.Course, {
  through: 'course_faculty',
  as: 'courses',
  foreignKey: 'userId'
});

db.Course.belongsToMany(db.Student, {
  through: 'course_student',
  as: 'students',
  foreignKey: 'courseId'
});

db.Student.belongsToMany(db.Course, {
  through: 'course_student',
  as: 'courses',
  foreignKey: 'userId'
});

module.exports = db;
