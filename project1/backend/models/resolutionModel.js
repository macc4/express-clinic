import { StatusCodes } from 'http-status-codes';

import AppError from '../utils/appError.js';
import formatName from '../utils/formatName.js';

import errorMessages from '../lib/errorMessages.js';

// add a temporary database
import db from '../db/db.js';

let { resolutions } = db;
//

class ResolutionModel {
  async create(body) {
    this.filterTTL();

    // serialization start

    let { name, expiry, resolution } = body;
    name = formatName.convertToBabelCase(name);

    // serialization end

    const duplicatePatient = resolutions.some((patient) => patient.name === name);

    if (duplicatePatient) {
      throw new AppError(errorMessages.CONFLICT, StatusCodes.CONFLICT);
    }

    const patient = {
      name: name,
      resolution: resolution,
      expiry: expiry,
    };

    resolutions.push(patient);

    return patient;
  }

  get(name) {
    this.filterTTL();
    return resolutions.filter((patient) => patient.name === name)[0];
  }

  async delete(name) {
    this.filterTTL();
    const deletedPatient = resolutions.filter((patient) => patient.name === name)[0];

    resolutions = resolutions.filter((patient) => patient.name !== name);

    return deletedPatient;
  }

  async filterTTL() {
    const currentDate = new Date();
    resolutions = resolutions.filter(
      (patient) => currentDate.getTime() < patient.expiry || patient.expiry === -1
    );
  }
}

const resolutionModel = new ResolutionModel();

export default resolutionModel;
