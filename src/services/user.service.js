import config from 'config';
import { AppError } from '../utils/errorClasses.js';
import sequelizeUserStorage from '../db/sequelize.user.storage.js';

const selectStorage = storage => {
  switch (storage) {
    case 'sequelize':
      return sequelizeUserStorage;
    default:
      throw new AppError(`This storage doesn't exist`, 404);
  }
};

const userStorage = selectStorage(config.get('db.types.main'));

const create = async body => await userStorage.createOne(body);

const getAll = async query => await userStorage.getAll(query);

const getByID = async params => await userStorage.getByID(params.userId);

const getOne = async query => await userStorage.getOne(query);

const deleteByID = async params => await userStorage.deleteByID(params.userId);

export default {
  create,
  getAll,
  getOne,
  getByID,
  deleteByID,
};
