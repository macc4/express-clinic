import config from 'config';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errorClasses.js';
import sequelizeUserStorage from '../db/sequelize.user.storage.js';
import passwordUtils from '../utils/passwordUtils.js';

const selectStorage = storageType => {
  switch (storageType) {
    case 'sequelize':
      return sequelizeUserStorage;
    default:
      throw new AppError(`This storage doesn't exist`, StatusCodes.NOT_FOUND);
  }
};
export class UserService {
  constructor(storage) {
    this.storage = storage;
  }

  async create(body) {
    const password = await passwordUtils.hashPassword(body.password);

    const user = await this.storage.createOne({
      name: body.name,
      email: body.email,
      password: password,
      role: body.role,
    });

    return user;
  }

  async getAll(query) {
    return await this.storage.getAll(query);
  }

  async getByEmail(email) {
    return await this.storage.getByEmail(email);
  }

  async getByID(id) {
    return await this.storage.getByID(id);
  }

  async deleteByID(id) {
    return await this.storage.deleteByID(id);
  }
}

const userService = new UserService(selectStorage(config.get('db.types.main')));

export default userService;
