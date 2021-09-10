export default (sequelize, Sequelize) => {
  const Resolution = sequelize.define(
    'resolution',
    {
      patientId: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      resolution: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      expiry: {
        type: Sequelize.BIGINT,
      },
    },
    { sequelize, modelName: 'resolution', timestamps: true },
  );

  return Resolution;
};
