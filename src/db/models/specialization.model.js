export default (sequelize, Sequelize) => {
  const Specialization = sequelize.define('specialization', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    classifier: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Specialization;
};
