export default (sequelize, Sequelize) => {
  const Role = sequelize.define('role', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Role;
};
