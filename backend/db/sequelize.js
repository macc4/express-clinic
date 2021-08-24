import { Sequelize } from 'sequelize';
import config from 'config';

import Patient from './models/patientModel.js';
import Resolution from './models/resolutionModel.js';
import Queue from './models/queueModel.js';

const db = {};

const sequelize = new Sequelize(
  config.get('sequelize.db'),
  config.get('sequelize.user'),
  config.get('sequelize.password'),
  {
    host: process.env.MYSQL_HOSTNAME || 'localhost',
    dialect: config.get('sequelize.dialect'),
  }
);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.patients = Patient(sequelize, Sequelize);
db.queue = Queue(sequelize, Sequelize);
db.resolutions = Resolution(sequelize, Sequelize);

// HOW TO SETUP ASSOCIATIONS FOR QUEUE = PATIENTS????
// right now any patientId can be inserted in the queue

db.patients.hasMany(db.resolutions, {
  as: 'resolutions',
  onDelete: 'cascade',
  truncate: true,
  hooks: true,
});
db.resolutions.belongsTo(db.patients, { as: 'patient', foreignKey: 'patientId' });

db.connect = async () => {
  await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
  await db.sequelize.sync({ force: true });
  await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
  await db.patients.bulkCreate([
    { name: 'Bella Cullen' },
    { name: 'Edward Cullen' },
    { name: 'Jacob Black' },
  ]);
  console.log(`-----------------------------`);
  console.log('SQL database has been connected.');
};

export default db;
