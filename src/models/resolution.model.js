import getUnixExpiry from '../utils/getUnixExpiry.js';

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
      isExpired: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    { sequelize, modelName: 'resolution', timestamps: true },
  );

  // HOOKS
  // convert the expiry before storing
  Resolution.beforeSave(async resolution => {
    const expiry = getUnixExpiry(resolution.expiry);
    resolution.expiry = expiry;
  });

  // PROTOTYPE METHODS
  // check if the resolution is expired
  Resolution.prototype.checkIfExpired = expiry => {
    const currentDate = new Date();

    if (expiry === -1) return false;
    if (currentDate.getTime() > expiry) return true;

    return false;
  };

  return Resolution;
};
