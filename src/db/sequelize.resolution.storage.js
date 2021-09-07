import SequelizeFactoryStorage from './sequelize.factory.storage.js';
import db from './clients/sequelize.client.js';

class SequelizeResolutionStorage {
  constructor(factory, storage) {
    this.factory = factory;
    this.storage = storage;
  }

  async createOne(body) {
    await this.factory.createOne(body);
  }

  async deleteOne(id) {
    await this.factory.deleteOne(id);
  }

  async getOne(id) {
    const resolution = await this.storage.resolutions.findByPk(id);

    if (resolution.isExpired) {
      return undefined;
    }

    const expired = resolution.checkIfExpired(resolution.expiry);

    if (expired) {
      resolution.isExpired = true;
      await resolution.save({ fields: ['isExpired'] });

      return undefined;
    }

    return resolution;
  }

  // // eslint-disable-next-line no-unused-vars
  async getAll(query) {
    const queryConditions = { isExpired: false };

    if (query.patientId) {
      queryConditions.patientId = {
        [db.Sequelize.Op.eq]: `${query.patientId}`,
      };
    }

    const resolutionsCheck = await this.storage.resolutions.findAll({
      where: queryConditions,
    });

    resolutionsCheck.forEach(async resolution => {
      const isExpired = resolution.checkIfExpired(resolution.expiry);
      if (isExpired) {
        resolution.isExpired = true;
        await resolution.save({ fields: ['isExpired'] });
      }
    });

    const resolutions = resolutionsCheck.filter(
      resolution => resolution.isExpired === false,
    );

    return resolutions;
  }
}

const sequelizeResolutionStorage = new SequelizeResolutionStorage(
  new SequelizeFactoryStorage('Resolutions'),
  db,
);

export default sequelizeResolutionStorage;
