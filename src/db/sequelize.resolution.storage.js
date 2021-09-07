import sequelize from './clients/sequelize.client.js';

class SequelizeResolutionStorage {
  constructor(client) {
    this.client = client;
  }

  async createOne(body) {
    return await this.client.resolutions.create(body);
  }

  async deleteByID(id) {
    return await this.client.resolutions.destroy({ where: { id } });
  }

  async getByID(id) {
    const resolution = await this.client.resolutions.findByPk(id);

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

  async getAll(query) {
    const queryConditions = { isExpired: false };

    if (query.patientId) {
      queryConditions.patientId = {
        [this.client.Sequelize.Op.eq]: `${query.patientId}`,
      };
    }

    const resolutionsCheck = await this.client.resolutions.findAll({
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

const sequelizeResolutionStorage = new SequelizeResolutionStorage(sequelize);

export default sequelizeResolutionStorage;
