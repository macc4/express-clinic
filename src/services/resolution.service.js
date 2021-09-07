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

const createOne = async body => await resolutionStorage.createOne(body);
const getAll = async query => await resolutionStorage.getAll(query);
const getOne = async params =>
  await resolutionStorage.getOne(params.resolutionId);
const deleteOne = async params =>
  await resolutionStorage.deleteOne(params.resolutionId);

export default { createOne, getOne, getAll, deleteOne };
