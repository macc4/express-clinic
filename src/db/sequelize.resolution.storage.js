import sequelize from './clients/sequelize.client.js';

class SequelizeResolutionStorage {
  constructor(client) {
    this.client = client;
  }

  async createOne(body) {
    const data = await this.client.resolutions
      .create(body)
      .then(result => result.get({ plain: true }));

    return data;
  }

  async getAll(query) {
    const queryConditions = {};

    if (query.patientId) {
      queryConditions.patientId = {
        [this.client.Sequelize.Op.eq]: `${query.patientId}`,
      };
    }

    const resolutions = await this.client.resolutions.findAll({
      raw: true,
      where: queryConditions,
    });

    return resolutions;
  }

  async getByPatientName(name) {
    const query = `
    SELECT resolutions.id, resolutions.resolution, resolutions.createdAt, resolutions.expiry
    FROM resolutions
    INNER JOIN patients
    ON patients.id=resolutions.patientId
    WHERE patients.name="${name}"
    `;

    const resolutions = await this.client.sequelize.query(query, {
      raw: true,
      type: this.client.Sequelize.QueryTypes.SELECT,
    });

    return resolutions;
  }

  async deleteByID(id) {
    return await this.client.resolutions.destroy({ raw: true, where: { id } });
  }

  async getByID(id) {
    const resolution = await this.client.resolutions.findByPk(id, {
      raw: true,
    });

    return resolution;
  }

  async getByUserID(id) {
    const query = `
    SELECT resolutions.id, resolutions.resolution, resolutions.createdAt, resolutions.expiry
    FROM resolutions
    INNER JOIN patients
    ON patients.id=resolutions.patientId
    WHERE patients.userId="${id}"
    `;

    const resolutions = await this.client.sequelize.query(query, {
      raw: true,
      type: this.client.Sequelize.QueryTypes.SELECT,
    });

    return resolutions;
  }
}

const sequelizeResolutionStorage = new SequelizeResolutionStorage(sequelize);

export default sequelizeResolutionStorage;
