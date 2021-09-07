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

const createOne = async body => {
  const user = await userStorage.createOne(body);

  if (!user) {
    return undefined;
  }

  user.password = undefined;
  user.passwordConfirm = undefined;
  user.passwordChangedAt = undefined;

  return user;
};

const getAll = async query => {
  const users = await userStorage.getAll(query);

  if (!users) {
    return undefined;
  }

  users.forEach = user => {
    user.password = undefined;
    user.passwordConfirm = undefined;
    user.passwordChangedAt = undefined;
  };

  return users;
};

const getOne = async params => {
  const user = await userStorage.getOne(params.patientId);

  if (!user) {
    return undefined;
  }

  user.password = undefined;
  user.passwordConfirm = undefined;
  user.passwordChangedAt = undefined;

  return user;
};

const deleteOne = async params => {
  const user = await userStorage.deleteOne(params.patientId);

  if (!user) {
    return undefined;
  }

  return user;
};

export default { createOne, getOne, getAll, deleteOne };
