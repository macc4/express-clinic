import SequelizeFactoryStorage from './sequelize.factory.storage.js';
import db from './clients/sequelize.client.js';

class SequelizeUserStorage {
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

  async getAll(query) {
    const queryConditions = {};

    if (query.role) {
      queryConditions.role = {
        [db.Sequelize.Op.like]: `%${query.role}%`,
      };
    }

    const users = await this.storage.users.findAll({ where: queryConditions });

    return users;
  }
}

const sequelizeUserStorage = new SequelizeUserStorage(
  new SequelizeFactoryStorage('Users'),
  db,
);

export default sequelizeUserStorage;
