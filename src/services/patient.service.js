import config from 'config';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errorClasses.js';
import sequelizePatientStorage from '../db/sequelize.patient.storage.js';

const selectStorage = storageType => {
  switch (storageType) {
    case 'sequelize':
      return sequelizePatientStorage;
    default:
      throw new AppError(`This storage doesn't exist`, StatusCodes.NOT_FOUND);
  }
};

export class PatientService {
  constructor(storage) {
    this.storage = storage;
  }

  async create(body) {
    const patient = await this.storage.createOne(body);

    return patient;
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

const patientService = new PatientService(
  selectStorage(config.get('db.types.main')),
);

export default patientService;
