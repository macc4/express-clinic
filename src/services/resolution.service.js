import config from 'config';
import { AppError } from '../utils/errorClasses.js';
import sequelizeResolutionStorage from '../db/sequelize.resolution.storage.js';

const selectStorage = storage => {
  switch (storage) {
    case 'sequelize':
      return sequelizeResolutionStorage;
    default:
      throw new AppError(`This storage doesn't exist`, 404);
  }
};

const resolutionStorage = selectStorage(config.get('db.types.main'));

const create = async body => await resolutionStorage.createOne(body);

const getAll = async query => await resolutionStorage.getAll(query);

const getByID = async params =>
  await resolutionStorage.getByID(params.resolutionId);

const deleteByID = async params =>
  await resolutionStorage.deleteByID(params.resolutionId);

export default {
  create,
  getAll,
  getByID,
  deleteByID,
};
