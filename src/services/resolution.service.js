import config from 'config';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errorClasses.js';
import sequelizeResolutionStorage from '../db/sequelize.resolution.storage.js';
import expiryUtils from '../utils/expiryUtils.js';

const selectStorage = storageType => {
  switch (storageType) {
    case 'sequelize':
      return sequelizeResolutionStorage;
    default:
      throw new AppError(`This storage doesn't exist`, StatusCodes.NOT_FOUND);
  }
};
export class ResolutionService {
  constructor(storage) {
    this.storage = storage;
  }

  async checkForNotExpiredOrDelete(resolution) {
    const expired = expiryUtils.checkIfExpired(resolution.expiry);

    if (expired) {
      await this.storage.deleteByID(resolution.id);

      return false;
    }

    return true;
  }

  async filterResolutionsArrayByExpiry(resolutions) {
    const data = await Promise.all(
      resolutions.map(async resolution => {
        const notExpired = await this.checkForNotExpiredOrDelete(resolution);

        if (notExpired) {
          return resolution;
        }

        return undefined;
      }),
    );

    const filteredResolutions = data.filter(
      resolution => resolution !== undefined,
    );

    return filteredResolutions;
  }

  async create(body) {
    body.expiry = expiryUtils.getUnixExpiry(
      body.expiry,
      config.get('app.timeToLive'),
    );

    const resolution = await this.storage.createOne(body);

    return resolution;
  }

  async getAll(query) {
    const data = await this.storage.getAll(query);

    return data;
  }

  async getByUserID(id) {
    const data = await this.storage.getByUserID(id);

    return data;
  }

  async getByPatientName(name) {
    const data = await this.storage.getByPatientName(name);

    return data;
  }

  async getByID(id) {
    const resolution = await this.storage.getByID(id);

    if (resolution) {
      const notExpired = await this.checkForNotExpiredOrDelete(resolution);

      if (notExpired) return resolution;
    }

    return undefined;
  }

  async deleteByID(id) {
    return await this.storage.deleteByID(id);
  }
}

const resolutionService = new ResolutionService(
  selectStorage(config.get('db.types.main')),
);

export default resolutionService;
