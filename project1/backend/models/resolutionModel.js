import config from 'config';

import { StatusCodes } from 'http-status-codes';
import errorMessages from '../lib/errorMessages.js';

import bodyDecorator from '../utils/bodyDecorator.js';

import AppError from '../utils/appError.js';

// databases
import { db } from '../db/in-memory.js';
import {
  existsAsync,
  getAsync,
  setAsync,
  pexpireatAsync,
  pttlAsync,
  delAsync,
} from '../db/redis.js';

// in-memory
let { resolutions } = db;

class ResolutionInMemoryModel {
  create(body) {
    this.filterTTL();

    let { name, expiry, resolution } = body;
    name = bodyDecorator.convertNameToBabelCase(name);

    // check for duplicate data
    const duplicatePatient = resolutions.some((patient) => patient.name === name);

    if (duplicatePatient) {
      throw new AppError(errorMessages.CONFLICT, StatusCodes.CONFLICT);
    }

    // push patient
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

    const currentPatient = resolutions.filter((patient) => patient.name === name)[0];

    if (!currentPatient) {
      return undefined;
    }

    const returnedPatient = Object.assign({}, currentPatient);
    returnedPatient.name = bodyDecorator.capitalizeNameFromBabelCase(
      returnedPatient.name
    );

    return returnedPatient;
  }

  delete(name) {
    this.filterTTL();

    const deletedPatient = resolutions.filter((patient) => patient.name === name)[0];

    resolutions = resolutions.filter((patient) => patient.name !== name);

    return deletedPatient;
  }

  filterTTL() {
    const currentDate = new Date();
    resolutions = resolutions.filter(
      (patient) => currentDate.getTime() < patient.expiry || patient.expiry === -1
    );
  }
}

class ResolutionRedisModel {
  async create(body) {
    let { name, expiry, resolution } = body;

    name = bodyDecorator.convertNameToBabelCase(name);

    const storeName = 'resolutions:' + name;

    // check for duplicate data
    const duplicatePatient = await existsAsync(storeName);

    if (duplicatePatient) {
      throw new AppError(errorMessages.CONFLICT, StatusCodes.CONFLICT);
    }

    // push patient
    const patient = {
      name: storeName,
      resolution: resolution,
      expiry: expiry,
    };

    setAsync(patient.name, patient.resolution);
    if (patient.expiry !== -1) {
      pexpireatAsync(patient.name, patient.expiry);
    }

    patient.name = name;

    return patient;
  }

  async get(name) {
    const searchName = 'resolutions:' + name;
    const resolution = await getAsync(searchName);

    if (!resolution) {
      return undefined;
    }

    // PTTL is redis's function, shows TTL in ms, returns -1 if none
    const PTTL = await pttlAsync(searchName);

    let expiry;
    if (PTTL === -1) {
      expiry = PTTL;
    } else {
      const currentDate = new Date();
      expiry = currentDate.getTime() + PTTL;
    }

    const returnedPatient = {
      name: bodyDecorator.capitalizeNameFromBabelCase(
        searchName.replace('resolutions:', '')
      ),
      resolution: resolution,
      expiry: expiry,
    };

    return returnedPatient;
  }

  async delete(name) {
    const searchName = 'resolutions:' + name;
    const resolution = await getAsync(searchName);

    if (!resolution) {
      return undefined;
    }
    const expiry = await pttlAsync(searchName);

    const returnedPatient = {
      name: name,
      resolution: resolution,
      expiry: expiry,
    };

    await delAsync(searchName);

    // return at least something so the resolutionController will know that the operation was performed ;-;
    return returnedPatient;
  }
}

class ResolutionFactory {
  constructor(type) {
    this.type = type;
  }

  create() {
    switch (this.type) {
      case 'in-memory':
        return new ResolutionInMemoryModel();
      case 'redis':
        return new ResolutionRedisModel();
    }
  }
}

const resolutionFactory = new ResolutionFactory(config.get('db.type'));
const resolutionModel = resolutionFactory.create();

export default resolutionModel;
