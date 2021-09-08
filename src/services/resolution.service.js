import config from 'config';
import { AppError } from '../utils/errorClasses.js';
import sequelizeResolutionStorage from '../db/sequelize.resolution.storage.js';
import expiryUtils from '../utils/expiryUtils.js';

class ResolutionService {
  constructor(storageType) {
    this.storage = this.selectStorage(storageType);
  }

  selectStorage(storage) {
    switch (storage) {
      case 'sequelize':
        return sequelizeResolutionStorage;
      default:
        throw new AppError(`This storage doesn't exist`, 404);
    }
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

  async getByUserID(id) {
    const data = await this.storage.getByUserID(id);

    if (data.length !== 0) {
      return this.filterResolutionsArrayByExpiry(data);
    }

    return [];
  }

  async getAll(query) {
    const data = await this.storage.getAll(query);

    if (data.length !== 0) {
      return this.filterResolutionsArrayByExpiry(data);
    }

    return [];
  }

  async getResolutionsByPatientName(name) {
    const data = await this.storage.getByPatientName(name);

    if (data.length !== 0) {
      return this.filterResolutionsArrayByExpiry(data);
    }

    return [];
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

const resolutionService = new ResolutionService(config.get('db.types.main'));

export default resolutionService;
