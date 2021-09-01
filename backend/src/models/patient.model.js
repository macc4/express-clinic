// eslint-disable-next-line no-unused-vars
export default (sequelize, Sequelize) => {
  const Patient = sequelize.define(
    'patient',
    {},
    { sequelize, modelName: 'patient', timestamps: true },
  );

  return Patient;
};
