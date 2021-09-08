import config from 'config';
import { AppError } from '../utils/errorClasses.js';
import sequelizePatientStorage from '../db/sequelize.patient.storage.js';

class PatientService {
  constructor(storageType) {
    this.storage = this.selectStorage(storageType);
  }

  selectStorage(storage) {
    switch (storage) {
      case 'sequelize':
        return sequelizePatientStorage;
      default:
        throw new AppError(`This storage doesn't exist`, 404);
    }
  }

  async create(body) {
    try {
      const patient = await this.storage.createOne(body);

      return patient;
    } catch {
      throw new AppError(
        `This userId already has a corresponding patient`,
        404,
      );
    }
  }

  async getAll(query) {
    return await this.storage.getAll(query);
  }

  async getByID(id) {
    return await this.storage.getByID(id);
  }

  async deleteByID(id) {
    return await this.storage.deleteByID(id);
  }

  async getByUserID(userId) {
    return await this.storage.getByUserID(userId);
  }
}

const patientService = new PatientService(config.get('db.types.main'));

export default patientService;
