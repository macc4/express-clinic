export default (sequelize, Sequelize) => {
  const Model = Sequelize.Model;

  class Patient extends Model {}

  Patient.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
      },
    },
    { sequelize, modelName: 'patient', timestamps: false }
  );
  return Patient;
};
