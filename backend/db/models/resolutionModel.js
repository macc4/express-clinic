export default (sequelize, Sequelize) => {
  const Model = Sequelize.Model;

  class Resolution extends Model {}

  Resolution.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      resolution: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      expiry: {
        type: Sequelize.DATE,
      },
    },
    { sequelize, modelName: 'resolution', timestamps: true }
  );

  return Resolution;
};
