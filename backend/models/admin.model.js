module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define("admin", {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    adminLevel: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      comment: '1: regular, 2: super admin'
    }
  });

  return Admin;
};
