export default (sequelize, Sequelize) => {
  const Resolution = sequelize.define(
    'resolution',
    {
      resolution: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    },
    { sequelize, modelName: 'resolution', timestamps: true },
  );

  return Resolution;
};
