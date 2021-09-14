export default (sequelize, Sequelize) => {
  const Role = sequelize.define('role', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Role;
};
