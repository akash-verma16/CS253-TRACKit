module.exports = (sequelize, Sequelize) => {
    const ForumPost = sequelize.define("forum_post", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      query: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  
    return ForumPost;
  };