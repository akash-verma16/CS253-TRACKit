module.exports = (sequelize, Sequelize) => {
  const Faculty = sequelize.define("faculty", {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    department: {
      type: Sequelize.STRING,
      allowNull: false
    },
    position: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return Faculty;
};
