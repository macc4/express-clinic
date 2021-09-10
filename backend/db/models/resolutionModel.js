export default (sequelize, Sequelize) => {
  return sequelize.define(
    'resolution',
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
        type: Sequelize.BIGINT,
      },
    },
    { sequelize, modelName: 'resolution', timestamps: true }
  );
};
