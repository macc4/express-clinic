import { AppError } from '../utils/errorClasses.js';
import db from './clients/sequelize.client.js';

class SequelizeFactoryStorage {
  constructor(model) {
    this.model = model;
    this.model = this.selectModel(this.model);
  }

  selectModel(model) {
    switch (model) {
      case 'Patients':
        return db.patients;
      case 'Users':
        return db.users;
      case 'Resolutions':
        return db.resolutions;
      default:
        throw new AppError(`This model doesn't exist`, 404);
    }
  }

  async createOne(body) {
    const data = await this.model.create(body);

    return data;
  }

  async getOne(id) {
    const data = await this.model.findByPk(id);

    return data;
  }

  async deleteOne(id) {
    const data = await this.model.destroy({ where: { id } });

    return data;
  }
}

export default SequelizeFactoryStorage;
