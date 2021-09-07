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

const createOne = async body => await patientStorage.createOne(body);
const getAll = async query => await patientStorage.getAll(query);
const getOne = async params => await patientStorage.getOne(params.patientId);
const deleteOne = async params =>
  await patientStorage.deleteOne(params.patientId);

export default { createOne, getOne, getAll, deleteOne };
