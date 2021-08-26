import redisClient from '../../db/redis.js';
import { ModelConflictError } from '../../utils/errorClasses.js';

export default class QueueRedisService {
  constructor() {
    this.redis = redisClient.connect();
  }

  async enqueue(body) {
    const newPatientId = body.patientId;

    // checking if the patientId is already in the queue
    const queue = await this.redis.lrange('queue', 0, -1);

    const duplicatePatient = queue.some(
      (patient) => patient === `${newPatientId}`
    );

    if (duplicatePatient) {
      throw new ModelConflictError('You are already in the queue');
    }

    await this.redis.rpush('queue', newPatientId);
    return { patientId: +newPatientId };
  }

  async peek() {
    const patientId = await this.redis.lindex('queue', 0);

    if (patientId === null) {
      return undefined;
    }

    return { patientId: +patientId };
  }

  async dequeue() {
    const deletedPatientId = await this.redis.lpop('queue');

    if (!deletedPatientId) {
      return undefined;
    }

    return { patientId: +deletedPatientId };
  }
}
