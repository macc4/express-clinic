import redisClient from '../../db/redis.js';
import { capitalizeNameFromRegularCase } from '../../utils/bodyDecorator.js';
import { ModelConflictError } from '../../utils/errorClasses.js';

export default class PatientRedisService {
  constructor() {
    this.redis = redisClient.connect();
    this.increment = 0;
  }
  async createPatient(body) {
    this.increment++;

    const id = this.increment;
    const patientName = capitalizeNameFromRegularCase(body.name);

    const newPatientEntry = {
      id: id,
      name: patientName,
    };

    const results = await this.redis.scanAll(`*\"name\":\"${patientName}\"}`);

    if (results.length !== 0) {
      throw new ModelConflictError('This patient already exists');
    }

    this.redis.set('patients:' + JSON.stringify(newPatientEntry), 'data'); // right now the values are empty, because we perform searches by ID and by Name

    return newPatientEntry;
  }

  async getPatient(patientId) {
    const patient = await this.redis.scanAll(`patients:{\"id\":${patientId}*`);

    if (patient.length === 0) {
      return undefined;
    }

    const patientData = JSON.parse(patient[0].replace('patients:', ''));
    return patientData;
  }

  async getAllPatients(query) {
    let searchedPatients;

    if (query.name) {
      const data = await this.redis.scanAll(
        `patients:*${capitalizeNameFromRegularCase(query.name)}*`
      );
      searchedPatients = data.map((patient) =>
        JSON.parse(patient.replace('patients:', ''))
      );
    } else {
      const data = await this.redis.scanAll(`patients:*`);
      searchedPatients = data.map((patient) =>
        JSON.parse(patient.replace('patients:', ''))
      );
    }

    return searchedPatients;
  }

  async deletePatient(patientId) {
    const deletedPatient = await this.getPatient(patientId);

    await this.redis.del('patients:' + JSON.stringify(deletedPatient));

    if (!deletedPatient) {
      return undefined;
    }

    return deletedPatient;
  }
}
