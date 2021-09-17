export default (sequelize, Sequelize) => {
  const Specialization = sequelize.define('specialization', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Specialization;
};
