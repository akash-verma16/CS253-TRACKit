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
db.Announcement = require('./announcement.model')(sequelize, Sequelize);
db.CourseDescriptionEntry = require('./courseDescriptionEntry.model')(sequelize, Sequelize);

// Setup relationships
// User relationships with specialized models
db.User.hasOne(db.Faculty, { foreignKey: 'userId' });
db.Faculty.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasOne(db.Student, { foreignKey: 'userId' });
db.Student.belongsTo(db.User, { foreignKey: 'userId' });

// Course relationships
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

// Announcement relationships
db.Course.hasMany(db.Announcement, { foreignKey: 'courseId', as: 'announcements' });
db.Announcement.belongsTo(db.Course, { foreignKey: 'courseId' });

db.Faculty.hasMany(db.Announcement, { foreignKey: 'facultyId', as: 'announcements' });
db.Announcement.belongsTo(db.Faculty, { foreignKey: 'facultyId' });

// Course Description Entry relationships
db.Course.hasMany(db.CourseDescriptionEntry, { foreignKey: 'courseId', as: 'descriptionEntries' });
db.CourseDescriptionEntry.belongsTo(db.Course, { foreignKey: 'courseId' });

db.Faculty.hasMany(db.CourseDescriptionEntry, { foreignKey: 'facultyId', as: 'descriptionEntries' });
db.CourseDescriptionEntry.belongsTo(db.Faculty, { foreignKey: 'facultyId' });

module.exports = db;
