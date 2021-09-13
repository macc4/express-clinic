export default (sequelize, Sequelize) => {
    const Role = sequelize.define('role', {
      role: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  
    return Role;
  };
  