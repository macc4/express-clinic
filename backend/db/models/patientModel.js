export default (sequelize, Sequelize) => {
  return sequelize.define(
    'patient',
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
};
