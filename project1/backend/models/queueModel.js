import config from 'config';
import { StatusCodes } from 'http-status-codes';
import errorMessages from '../lib/errorMessages.js';

import bodyDecorator from '../utils/bodyDecorator.js';

import AppError from '../utils/appError.js';

// databases
import { db } from '../db/in-memory.js';
import {
  lpushAsync,
  rpushAsync,
  lindexAsync,
  lpopAsync,
  lrangeAsync,
} from '../db/redis.js';

// in-memory
let { queue } = db;

class QueueInMemoryModel {
  async enqueue(body) {
    let { name } = body;
    name = bodyDecorator.capitalizeNameFromRegularCase(name);
    let expiry = bodyDecorator.getUnixExpiryFromTTL(body);

    // checking for duplicate data
    const duplicatePatient = queue.some((patient) => patient.name === name);

    if (duplicatePatient) {
      throw new AppError(errorMessages.CONFLICT, StatusCodes.CONFLICT);
    }

    // pushing the data
    const patient = {
      name: name,
      expiry: expiry,
    };

    queue.push(patient);
    return patient;
  }

  peek() {
    return queue[0];
  }

  async dequeue() {
    this.filterTTL();

    return queue.shift();
  }

  async filterTTL() {
    const currentDate = new Date();

    // filter out every person except the ones that are not expired, without expiry, and the first person in the queue
    // because he will be dequeued nevertheless of expiry
    queue = queue.filter(
      (patient, index) =>
        currentDate.getTime() < patient.expiry || patient.expiry === -1 || index === 0
    );
  }
}

class QueueRedisModel {
  async enqueue(body) {
    let { name } = body;
    name = bodyDecorator.capitalizeNameFromRegularCase(name);
    let expiry = bodyDecorator.getUnixExpiryFromTTL(body);

    // checking for duplicate data
    let data = await lrangeAsync('queue', 0, -1);
    let queue = data.map((patient) => JSON.parse(patient));

    const duplicatePatient = queue.some((patient) => patient.name === name);

    if (duplicatePatient) {
      throw new AppError(errorMessages.CONFLICT, StatusCodes.CONFLICT);
    }

    // pushing the data
    const patient = {
      name: name,
      expiry: expiry,
    };

    await rpushAsync('queue', JSON.stringify(patient));
    return patient;
  }

  async peek() {
    let patient = JSON.parse(await lindexAsync('queue', 0));
    if (patient === null) {
      patient = undefined;
    }
    return patient;
  }

  async dequeue() {
    this.filterTTL();

    const deletedPatient = await lindexAsync('queue', 0);

    await lpopAsync('queue');
    return JSON.parse(deletedPatient);
  }

  async filterTTL() {
    const currentDate = new Date();

    // store the first patient, because he/she is currently being processed, even if expired
    const currentPatient = JSON.parse(await lindexAsync('queue', 0));

    // store the second patient to check
    const secondPatient = JSON.parse(await lindexAsync('queue', 1));
    if (secondPatient === null) {
      // if there is no second patient - return
      return;
    }

    let expired = true;

    // check if not expired
    if (currentDate.getTime() < secondPatient.expiry || secondPatient.expiry === -1) {
      expired = false;
    }

    // if not expired, then just do nothing else
    if (expired) {
      await lpopAsync('queue');
      await lpopAsync('queue');
      await lpushAsync('queue', JSON.stringify(currentPatient));

      // start recursing through the function until we find a non-expired patient
      this.dequeue();
    }
  }
}

class QueueFactory {
  constructor(type) {
    this.type = type;
  }

  create() {
    switch (this.type) {
      case 'in-memory':
        return new QueueInMemoryModel();
      case 'redis':
        return new QueueRedisModel();
    }
  }
}

const queueFactory = new QueueFactory(config.get('db.type'));
const queueModel = queueFactory.create();

export default queueModel;
