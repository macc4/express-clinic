import config from 'config';
import db from '../../db/redis.js';
import { capitalizeNameFromRegularCase } from '../../utils/bodyDecorator.js';
import { ModelConflictError } from '../../utils/errorClasses.js';

let increment = 0;

if (config.get('db.type') === 'redis') {
  db.client = db.RedisClient.connect();
}

export default class PatientRedisService {
  async createPatient(body) {
    increment++;

    const id = increment;
    const patientName = capitalizeNameFromRegularCase(body.name);

    const newPatientEntry = {
      id: id,
      name: patientName,
    };

    const results = await db.client.scanAll(`*\"name\":\"${patientName}\"}`);

    if (results.length !== 0) {
      throw new ModelConflictError('This patient already exists');
    }

    db.client.set('patients:' + JSON.stringify(newPatientEntry), 'data'); // right now the values are empty, because we perform searches by ID and by Name

    return newPatientEntry;
  }

  async getPatient(patientId) {
    const patient = await db.client.scanAll(`patients:{\"id\":${patientId}*`);

    if (patient.length === 0) {
      return undefined;
    }

    const patientData = JSON.parse(patient[0].replace('patients:', ''));
    return patientData;
  }

  async getAllPatients(query) {
    let searchedPatients;

    if (query.name) {
      const data = await db.client.scanAll(`patients:*${query.name}*`);
      searchedPatients = data.map((patient) =>
        JSON.parse(patient.replace('patients:', ''))
      );
      console.log(searchedPatients);
    } else {
      const data = await db.client.scanAll(`patients:*`);
      searchedPatients = data.map((patient) =>
        JSON.parse(patient.replace('patients:', ''))
      );
      console.log(searchedPatients);
    }

    return searchedPatients;
  }

  async deletePatient(patientId) {
    const deletedPatient = await this.getPatient(patientId);

    await db.client.del('patients:' + JSON.stringify(deletedPatient));

    if (!deletedPatient) {
      return undefined;
    }

    return deletedPatient;
  }
}
