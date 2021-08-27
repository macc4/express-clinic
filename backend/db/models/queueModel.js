export default (sequelize, Sequelize) => {
  return sequelize.define(
    'queue',
    {
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
    },
    { sequelize, modelName: 'queue', timestamps: true, freezeTableName: true }
  );
};
