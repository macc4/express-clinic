import config from 'config';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errorClasses.js';
import redisQueueStorage from '../db/redis.queue.storage.js';

const selectStorage = storageType => {
  switch (storageType) {
    case 'redis':
      return redisQueueStorage;
    default:
      throw new AppError(`This storage doesn't exist`, StatusCodes.NOT_FOUND);
  }
};

export class QueueService {
  constructor(storage) {
    this.storage = storage;
  }

  async getQueue(doctorId) {
    return await this.storage.getQueue(doctorId);
  }

  async enqueue(patientId, doctorId) {
    // checking if the patientId is already in the queue
    const queue = await this.getQueue(doctorId);

    const duplicate = queue.some(patient => patient === `${patientId}`);

    if (duplicate) {
      throw new AppError('You are already in the queue', StatusCodes.CONFLICT);
    }

    await this.storage.enqueue(patientId, doctorId);

    return { patientId: +patientId };
  }

  async peek(doctorId) {
    const patientId = await this.storage.peek(doctorId);

    if (!patientId) {
      return undefined;
    }

    return { patientId: +patientId };
  }

  async dequeue(doctorId) {
    const deletedPatientId = await this.storage.dequeue(doctorId);

    if (!deletedPatientId) {
      return undefined;
    }

    return { patientId: +deletedPatientId };
  }
}

const queueService = new QueueService(
  selectStorage(config.get('db.types.queue')),
);

export default queueService;
