export default (sequelize, Sequelize) => {
  const Model = Sequelize.Model;

  class Queue extends Model {}

  Queue.init(
    {
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
    },
    { sequelize, modelName: 'queue', timestamps: true, freezeTableName: true }
  );
  return Queue;
};
