import sequelize from './clients/sequelize.client.js';

export class SequelizeUserStorage {
  constructor(client) {
    this.client = client;
  }

  async createOne(body) {
    const data = await this.client.users.create(body);

    data.setRoles(body.role);

    return data;
  }

  async getByID(id) {
    const data = await this.client.users.findByPk(id, {
      raw: true,
      include: [this.client.roles],
    });
    return data;
  }

  async deleteByID(id) {
    const data = await this.client.users.destroy({ raw: true, where: { id } });

    return data;
  }

  async getByEmail(email) {
    const user = await this.client.users.findOne({
      raw: true,
      where: { email },
      include: [this.client.roles],
    });

    return user;
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
      include: [this.client.roles],
    });

    return users;
  }
}

const sequelizeUserStorage = new SequelizeUserStorage(sequelize);

export default sequelizeUserStorage;
