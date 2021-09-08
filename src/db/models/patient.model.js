// eslint-disable-next-line no-unused-vars
export default (sequelize, Sequelize) => {
  const Patient = sequelize.define(
    'patient',
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'non-binary'),
        defaultValue: 'non-binary',
        allowNull: false,
      },
      birthday: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        foreignKey: true,
        allowNull: false,
        unique: true,
      },
    },
    { sequelize, modelName: 'patient', timestamps: true },
  );

  return Patient;
};
