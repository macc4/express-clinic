import redisClient, { redisScan } from '../../db/redis.js';
import { capitalizeNameFromRegularCase } from '../../utils/formatName.js';
import { ModelConflictError } from '../../utils/errorClasses.js';

export default class PatientRedisService {
  constructor() {
    this.redis = redisClient.connect();
    this.increment = 0;
    this.patientKey = 'patients:';
  }
  async createPatient(body) {
    this.increment++;

    const id = this.increment;
    const patientName = capitalizeNameFromRegularCase(body.name);

    const newPatientEntry = {
      id: id,
      name: patientName,
    };

    const results = await redisScan(
      this.redis,
      `*\"name\":\"${patientName}\"}`
    );

    if (results.length !== 0) {
      throw new ModelConflictError('This patient already exists');
    }

    this.redis.set(this.patientKey + JSON.stringify(newPatientEntry), 'data'); // right now the values are empty, because we perform searches by ID and by Name

    return newPatientEntry;
  }

  async getPatient(patientId) {
    const patient = await redisScan(
      this.redis,
      `${this.patientKey}{\"id\":${patientId}*`
    );

    if (patient.length === 0) {
      return undefined;
    }

    const patientData = JSON.parse(patient[0].replace(this.patientKey, ''));
    return patientData;
  }

  async getAllPatients(query) {
    let searchedPatients;

    if (query.name) {
      const data = await redisScan(
        this.redis,
        `${this.patientKey}*${capitalizeNameFromRegularCase(query.name)}*`
      );
      searchedPatients = data.map(patient =>
        JSON.parse(patient.replace(this.patientKey, ''))
      );
    } else {
      const data = await redisScan(this.redis, `${this.patientKey}*`);
      searchedPatients = data.map(patient =>
        JSON.parse(patient.replace(this.patientKey, ''))
      );
    }

    return searchedPatients;
  }

  async deletePatient(patientId) {
    const deletedPatient = await this.getPatient(patientId);

    await this.redis.del(this.patientKey + JSON.stringify(deletedPatient));

    if (!deletedPatient) {
      return undefined;
    }

    return deletedPatient;
  }
}