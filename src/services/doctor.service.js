import config from 'config';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errorClasses.js';
import sequelizeDoctorStorage from '../db/sequelize.doctor.storage.js';

const selectStorage = storageType => {
  switch (storageType) {
    case 'sequelize':
      return sequelizeDoctorStorage;
    default:
      throw new AppError(`This storage doesn't exist`, StatusCodes.NOT_FOUND);
  }
};

export class DoctorService {
  constructor(storage) {
    this.storage = storage;
  }

  async getAll() {
    return await this.storage.getAll();
  }

  async getByID(id) {
    return await this.storage.getByID(id);
  }

  async getByUserID(userId) {
    return await this.storage.getByUserID(userId);
  }
}

const doctorService = new DoctorService(
  selectStorage(config.get('db.types.main')),
);

export default doctorService;
