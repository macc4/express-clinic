import { StatusCodes } from 'http-status-codes';

import AppError from '../utils/appError.js';
import formatName from '../utils/formatName.js';

import { getExpiryDate } from '../utils/decoratorTTL.js';

import errorMessages from '../lib/errorMessages.js';

// add a temporary database
import db from '../db/db.js';

let { queue } = db;
//

class QueueModel {
  async enqueue(body) {
    this.filterTTL();

    // serialization start

    let { name, timeToLive } = body;
    let expiry;
    name = formatName.capitalizeFromRegularCase(name);

    if (timeToLive === -1) {
      expiry = -1;
    } else {
      expiry = getExpiryDate(timeToLive);
    }

    // serialization end

    const duplicatePatient = queue.some((patient) => patient.name === name);

    if (duplicatePatient) {
      throw new AppError(errorMessages.CONFLICT, StatusCodes.CONFLICT);
    }

    const patient = {
      name: name,
      expiry: expiry,
    };

    queue.push(patient);

    return patient;
  }

  peek(id) {
    this.filterTTL();

    return queue[id - 1];
  }

  async dequeue(id) {
    this.filterTTL();

    const deletedPatient = queue[id - 1];
    queue.splice(id - 1, 1);

    return deletedPatient;
  }

  async filterTTL() {
    const currentDate = new Date();
    queue = queue.filter(
      (patient) => currentDate.getTime() < patient.expiry || patient.expiry === -1
    );
  }
}

const queueModel = new QueueModel();

export default queueModel;
