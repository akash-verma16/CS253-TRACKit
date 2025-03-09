module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("student", {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    enrollmentYear: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    major: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return Student;
};
