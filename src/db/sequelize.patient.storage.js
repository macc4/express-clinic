import SequelizeFactoryStorage from './sequelize.factory.storage.js';
import db from './clients/sequelize.client.js';

class SequelizePatientStorage {
  constructor(factory, storage) {
    this.factory = factory;
    this.storage = storage;
  }

  async createOne(body) {
    await this.factory.createOne(body);
  }

  async getOne(id) {
    await this.factory.getOne(id);
  }

  async deleteOne(id) {
    await this.factory.deleteOne(id);
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

    const patients = await this.storage.patients.findAll({
      where: queryConditions,
    });

    return patients;
  }
}

const sequelizePatientStorage = new SequelizePatientStorage(
  new SequelizeFactoryStorage('Patients'),
  db,
);

export default sequelizePatientStorage;
