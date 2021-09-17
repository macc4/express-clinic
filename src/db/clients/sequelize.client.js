import { Sequelize } from 'sequelize';
import config from 'config';

import User from '../models/user.model.js';
import Patient from '../models/patient.model.js';
import Resolution from '../models/resolution.model.js';
import Doctor from '../models/doctor.model.js';
import Specialization from '../models/specialization.model.js';
import Role from '../models/role.model.js';
import runSeeders from './utils/seeding.js';

const db = {};

const sequelize = new Sequelize(
  config.get('db.sequelize.db'),
  config.get('db.sequelize.user'),
  config.get('db.sequelize.password'),
  {
    host: process.env.MYSQL_HOST || config.get('db.sequelize.host'),
    dialect: config.get('db.sequelize.dialect'),
  },
);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = User(sequelize, Sequelize);
db.patients = Patient(sequelize, Sequelize);
db.resolutions = Resolution(sequelize, Sequelize);
db.doctors = Doctor(sequelize, Sequelize);
db.specializations = Specialization(sequelize, Sequelize);
db.roles = Role(sequelize, Sequelize);

// ASSOCIATIONS
db.users.hasOne(db.patients, {
  // foreignKey: 'patientId',
  onDelete: 'cascade',
});

db.users.hasOne(db.doctors, {
  onDelete: 'cascade',
});

db.patients.belongsTo(db.users, {
  foreignKey: 'userId',
});

db.doctors.belongsTo(db.users, {
  foreignKey: 'userId',
});

db.doctors.belongsToMany(db.specializations, {
  through: 'doctor_specializations',
  foreignKey: 'doctorId',
  otherKey: 'specializationId',
});

db.specializations.belongsToMany(db.doctors, {
  through: 'doctor_specializations',
  foreignKey: 'specializationId',
  otherKey: 'doctorId',
});

db.patients.hasMany(db.resolutions, {
  onDelete: 'cascade',
  truncate: true,
  hooks: true,
});

db.resolutions.belongsTo(db.patients, {
  foreignKey: 'patientId',
});

db.roles.belongsToMany(db.users, {
  through: 'user_roles',
  foreignKey: 'roleId',
  otherKey: 'userId',
});

db.users.belongsToMany(db.roles, {
  through: 'user_roles',
  foreignKey: 'userId',
  otherKey: 'roleId',
});

db.connect = async () => {
  await db.sequelize.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.get('db.sequelize.db')}\`;`,
  );

  await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
  await db.sequelize.sync({ force: true });
  await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });

  try {
    await runSeeders(db);
  } catch (err) {
    console.log(err);
  }

  console.log('-----------------------------'); // eslint-disable-line no-console
  console.log('SQL database has been connected.'); // eslint-disable-line no-console
};

export default db;
