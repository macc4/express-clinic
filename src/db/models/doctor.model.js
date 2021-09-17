export default (sequelize, Sequelize) => {
  const Doctor = sequelize.define(
    'doctor',
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    { sequelize, modelName: 'doctor', timestamps: true },
  );

  return Doctor;
};
