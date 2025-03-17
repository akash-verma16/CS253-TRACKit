module.exports = (sequelize, Sequelize) => {
    const Exam = sequelize.define("exam", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      examName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      weightage: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      totalMarks: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      max: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      median: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      mode: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      deviation: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      courseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'course',
          key: 'id'
        }
      }
    });
  
    return Exam;
  };