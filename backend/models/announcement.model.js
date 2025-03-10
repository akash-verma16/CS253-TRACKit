module.exports = (sequelize, Sequelize) => {
    const Announcement = sequelize.define("announcement", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      courseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'course',
          key: 'id'
        }
      },
      facultyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'faculty',
          key: 'userId'
        }
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      // seenBy: {
      //   type: Sequelize.JSON,
      //   comment: 'List of student IDs who have seen the announcement'
      // },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  
    return Announcement;
  };
  