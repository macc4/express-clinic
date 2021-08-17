import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError.js';
import errorMessages from '../lib/errorMessages.js';
import {
  getUnixExpiryFromBody,
  convertNameToBabelCase,
  capitalizeNameFromBabelCase,
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

    // check for duplicate data
    const duplicatePatient = resolutions.some((patient) => patient.key === keyName);

    if (duplicatePatient) {
      throw new AppError(errorMessages.CONFLICT, StatusCodes.CONFLICT);
    }

    const newResolution = {
      key: 'unique key',
      resolution: resolution,
      date: currentDate.getTime(),
    };

    // push patient
    const patient = {
      key: keyName,
      name: capitalizeNameFromRegularCase(name),
      resolutions: newResolution,
      expiry: expiry,
    };

    resolutions.push(patient);

    return patient;
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
