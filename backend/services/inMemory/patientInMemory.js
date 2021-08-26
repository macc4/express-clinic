import db from '../../db/memory.js';
import { capitalizeNameFromRegularCase } from '../../utils/formatName.js';
import { ModelConflictError } from '../../utils/errorClasses.js';

let { patients } = db;
let increment = 0;

export default class PatientInMemoryService {
  async createPatient(body) {
    const name = capitalizeNameFromRegularCase(body.name);

    // check for duplicate data
    const patientIndex = patients.findIndex((patient) => patient.name === name);

    if (patientIndex !== -1) {
      throw new ModelConflictError('This patient already exists');
    }

    increment++;

    const newPatient = {
      id: increment,
      name: name,
    };

    patients.push(newPatient);

    return newPatient;
  }

  async getPatient(patientId) {
    const patient = patients.find((patient) => patient.id === +patientId);

    return patient;
  }

  async getAllPatients(query) {
    let searchedPatients;

    if (query.name) {
      searchedPatients = patients.filter((patient) =>
        patient.name.includes(capitalizeNameFromRegularCase(query.name))
      );
    } else {
      searchedPatients = patients;
    }

    return searchedPatients;
  }

  async deletePatient(patientId) {
    const deletedPatient = patients.find(
      (patient) => patient.id === +patientId
    );

    patients = patients.filter((patient) => patient.id !== +patientId);

    return deletedPatient;
  }
}
