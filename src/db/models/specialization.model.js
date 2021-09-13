export default (sequelize, Sequelize) => {
  const Specialization = sequelize.define('specialization', {
    classifier: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Specialization;
};
