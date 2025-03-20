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
    heading: {
      type: Sequelize.STRING,
      allowNull: false
    },
    subheading: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    lectureTitle: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    lectureDescription: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    pdfPaths: {
      type: Sequelize.TEXT, // Store as a JSON string
      allowNull: true
    },
    youtubeLink: {
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