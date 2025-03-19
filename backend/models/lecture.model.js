module.exports = (sequelize, Sequelize) => {
  const Lecture = sequelize.define("lecture", {
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
    week: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    topicTitle: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    lectureTitle: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    lectureDescription: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    pdfPath: {
      type: Sequelize.STRING,
      allowNull: true
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });

  return Lecture;
};