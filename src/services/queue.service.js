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

  async getQueue() {
    return await this.storage.getQueue();
  }

  async enqueue(patientId) {
    // checking if the patientId is already in the queue
    const queue = await this.getQueue();

    const duplicate = queue.some(patient => patient === `${patientId}`);

    if (duplicate) {
      throw new AppError('You are already in the queue', StatusCodes.CONFLICT);
    }

    await this.storage.enqueue(patientId);

    return { patientId: +patientId };
  }

  async peek() {
    const patientId = await this.storage.peek();

    if (!patientId) {
      return undefined;
    }

    return { patientId: +patientId };
  }

  async dequeue() {
    const deletedPatientId = await this.storage.dequeue();

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
