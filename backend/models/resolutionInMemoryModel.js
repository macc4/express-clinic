import {
  getUnixExpiryFromBody,
  convertNameToBabelCase,
  capitalizeNameFromRegularCase,
} from '../utils/bodyDecorator.js';
import { db } from '../db/in-memory.js';

let { resolutions } = db;

export class ResolutionInMemoryModel {
  create(body) {
    this.filterTTL();

    let { name, resolution } = body;
    const keyName = convertNameToBabelCase(name);
    const currentDate = new Date();
    const expiry = getUnixExpiryFromBody(body);

    const newResolutionEntry = {
      key: 'unique key',
      resolution: resolution,
      date: currentDate.getTime(),
    };

    // check for duplicate data
    const patientIndex = resolutions.findIndex((patient) => patient.key === keyName);

    // if exists, then simply add a new resolution to the patient resolution list
    if (patientIndex !== -1) {
      resolutions[patientIndex].resolutions.push(newResolutionEntry);
      return resolutions[patientIndex];
    } else {
      const patient = {
        key: keyName,
        name: capitalizeNameFromRegularCase(name),
        resolutions: [newResolutionEntry],
        expiry: expiry,
      };

      resolutions.push(patient);

      return patient;
    }
  }

  get(name) {
    this.filterTTL();
    const searchName = capitalizeNameFromRegularCase(name);

    const returnedPatient = resolutions.find((patient) => patient.name === searchName);

    if (!returnedPatient) {
      return undefined;
    }

    return returnedPatient;
  }

  delete(key) {
    this.filterTTL();

    const deletedPatient = resolutions.find((patient) => patient.key === key);

    resolutions = resolutions.filter((patient) => patient.key !== key);

    return deletedPatient;
  }

  filterTTL() {
    const currentDate = new Date();

    resolutions = resolutions.filter(
      (patient) => currentDate.getTime() < patient.expiry || patient.expiry === -1
    );
  }
}
