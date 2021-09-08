import config from 'config';
import { AppError } from '../utils/errorClasses.js';
import sequelizeUserStorage from '../db/sequelize.user.storage.js';
import passwordUtils from '../utils/passwordUtils.js';

class UserService {
  constructor(storageType) {
    this.storage = this.selectStorage(storageType);
  }

  selectStorage(storage) {
    switch (storage) {
      case 'sequelize':
        return sequelizeUserStorage;
      default:
        throw new AppError(`This storage doesn't exist`, 404);
    }
  }

  async create(body) {
    const password = await passwordUtils.hashPassword(body.password);

    try {
      const user = await this.storage.createOne({
        name: body.name,
        email: body.email,
        password: password,
      });

      return user;
    } catch {
      throw new AppError(`This email is already in use!`, 404);
    }
  }

  async getAll(query) {
    return await this.storage.getAll(query);
  }

  async getByEmail(email) {
    return await this.storage.getByEmail(email);
  }

  async getByID(id) {
    const user = await this.storage.getByID(id);

    return user;
  }

  async deleteByID(id) {
    return await this.storage.deleteByID(id);
  }
}

const userService = new UserService(config.get('db.types.main'));

export default userService;
