import sequelize from './clients/sequelize.client.js';

class SequelizeUserStorage {
  constructor(client) {
    this.client = client;
  }

  async createOne(body) {
    const data = await this.client.users
      .create(body)
      .then(result => result.get({ plain: true }));

    return data;
  }

  async getByID(id) {
    const data = await this.client.users.findByPk(id, { raw: true });

    return data;
  }

  async deleteByID(id) {
    const data = await this.client.users.destroy({ raw: true, where: { id } });

    return data;
  }

  async getOne(query) {
    const queryConditions = {};

    if (query.email) {
      queryConditions.email = {
        [this.client.Sequelize.Op.like]: `${query.email}`,
      };
    }

    const users = await this.client.users.findOne({
      raw: true,
      where: queryConditions,
    });

    return users;
  }

  async getAll(query) {
    const queryConditions = {};

    if (query.role) {
      queryConditions.role = {
        [this.client.Sequelize.Op.like]: `%${query.role}%`,
      };
    }

    const users = await this.client.users.findAll({
      raw: true,
      where: queryConditions,
    });

    return users;
  }
}

const sequelizeUserStorage = new SequelizeUserStorage(sequelize);

export default sequelizeUserStorage;
