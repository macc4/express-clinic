import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError.js';
import errorMessages from '../lib/errorMessages.js';
import { capitalizeNameFromRegularCase } from '../utils/bodyDecorator.js';
import { redisClient } from '../db/redis.js';

export class QueueRedisModel {
  async enqueue(body) {
    let { name } = body;
    const newPatient = capitalizeNameFromRegularCase(name.toLowerCase());

    // checking if the patient is already in the queue
    const queue = await redisClient.lrange('queue', 0, -1);

    const duplicatePatient = queue.some((patient) => patient === newPatient);

    if (duplicatePatient) {
      throw new AppError(errorMessages.CONFLICT, StatusCodes.CONFLICT);
    }

    await redisClient.rpush('queue', newPatient);
    return { name: newPatient };
  }

  async peek() {
    const patient = await redisClient.lindex('queue', 0);

    if (patient === null) {
      return undefined;
    }

    return { name: patient };
  }

  async dequeue() {
    const deletedPatient = await redisClient.lpop('queue');

    if (!deletedPatient) {
      return undefined;
    }

    return { name: deletedPatient };
  }
}
