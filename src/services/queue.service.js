import redisClient from '../db/redis.js';
import { ModelConflictError } from '../utils/errorClasses.js';

const redis = redisClient.connect();

const enqueue = async body => {
  const newPatientId = body.patientId;

  // checking if the patientId is already in the queue
  const queue = await redis.lrange('queue', 0, -1);

  const duplicatePatient = queue.some(patient => patient === `${newPatientId}`);

  if (duplicatePatient) {
    throw new ModelConflictError('You are already in the queue');
  }

  await redis.rpush('queue', newPatientId);
  return { patientId: +newPatientId };
};

const peek = async () => {
  const patientId = await redis.lindex('queue', 0);

  if (patientId === null) {
    return undefined;
  }

  return { patientId: +patientId };
};

const dequeue = async () => {
  const deletedPatientId = await redis.lpop('queue');

  if (!deletedPatientId) {
    return undefined;
  }

  return { patientId: +deletedPatientId };
};

export default { enqueue, peek, dequeue };
