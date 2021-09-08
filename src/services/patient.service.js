import config from 'config';
import { AppError } from '../utils/errorClasses.js';
import sequelizePatientStorage from '../db/sequelize.patient.storage.js';

const selectStorage = storage => {
  switch (storage) {
    case 'sequelize':
      return sequelizePatientStorage;
    default:
      throw new AppError(`This storage doesn't exist`, 404);
  }
};

const patientStorage = selectStorage(config.get('db.types.main'));

const create = async body => await patientStorage.createOne(body);

const getAll = async query => await patientStorage.getAll(query);

const getByID = async params => await patientStorage.getByID(params.patientId);

const deleteByID = async params =>
  await patientStorage.deleteByID(params.patientId);

const getByUserID = async id => await patientStorage.getByUserID(id);

export default {
  create,
  getAll,
  getByID,
  deleteByID,
  getByUserID,
};
