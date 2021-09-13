export default (sequelize, Sequelize) => {
  const Doctor = sequelize.define(
    'doctor',
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
  );

  return Doctor;
};
