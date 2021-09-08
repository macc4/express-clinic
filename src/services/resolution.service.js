import config from 'config';
import { AppError } from '../utils/errorClasses.js';
import sequelizeResolutionStorage from '../db/sequelize.resolution.storage.js';
import utilsExpiry from '../utils/expiryUtils.js';

const selectStorage = storage => {
  switch (storage) {
    case 'sequelize':
      return sequelizeResolutionStorage;
    default:
      throw new AppError(`This storage doesn't exist`, 404);
  }
};

const resolutionStorage = selectStorage(config.get('db.types.main'));

const checkForNotExpiredOrDelete = async resolution => {
  const expired = utilsExpiry.checkIfExpired(resolution.expiry);

  if (expired) {
    await resolutionStorage.deleteByID(resolution.id);

    return false;
  }

  return true;
};

const create = async body => {
  body.expiry = utilsExpiry.getUnixExpiry(
    body.expiry,
    config.get('app.timeToLive'),
  );

  const resolution = await resolutionStorage.createOne(body);

  return resolution;
};

const getAll = async query => {
  const data = await resolutionStorage.getAll(query);

  if (data.length !== 0) {
    const resolutions = data.filter(
      async resolution => await checkForNotExpiredOrDelete(resolution),
    );

    return resolutions;
  }

  return [];
};

const getByID = async params => {
  const resolution = await resolutionStorage.getByID(params.resolutionId);

  if (resolution) {
    const notExpired = await checkForNotExpiredOrDelete(resolution);

    if (notExpired) return resolution;
  }

  return undefined;
};

const getByUserID = async id => {
  const data = await resolutionStorage.getByUserID(id);

  if (data.length !== 0) {
    const resolutions = data.filter(
      async resolution => await checkForNotExpiredOrDelete(resolution),
    );

    return resolutions;
  }

  return [];
};

const deleteByID = async params =>
  await resolutionStorage.deleteByID(params.resolutionId);

export default {
  create,
  getAll,
  getByID,
  deleteByID,
  getByUserID,
};
