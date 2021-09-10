import sequelize from './clients/sequelize.client.js';

export class SequelizePatientStorage {
  constructor(client) {
    this.client = client;
  }

  async createOne(body) {
    const data = await this.client.patients
      .create(body)
      .then(result => result.get({ plain: true }));

    return data;
  }

  // eslint-disable-next-line no-unused-vars
  async getAll(query) {
    const queryConditions = {};

    // not used since our Patients entity doesn't really contain any data right now

    // if (query.name) {
    //   queryConditions.name = {
    //     [db.Sequelize.Op.like]: `'%${query.name}%`,
    //   };
    // }

    const patients = await this.client.patients.findAll({
      raw: true,
      where: queryConditions,
    });

    return patients;
  }

  async getByID(id) {
    return await this.client.patients.findByPk(id, { raw: true });
  }

  async deleteByID(id) {
    return await this.client.patients.destroy({ raw: true, where: { id } });
  }

  async getByUserID(id) {
    return await this.client.patients.findOne({
      raw: true,
      where: { userId: id },
    });
  }
}

const sequelizePatientStorage = new SequelizePatientStorage(sequelize);

export default sequelizePatientStorage;
