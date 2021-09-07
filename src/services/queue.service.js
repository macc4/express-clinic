import config from 'config';
import { ModelConflictError, AppError } from '../utils/errorClasses.js';
import redisQueueStorage from '../db/redis.queue.storage.js';

const selectStorage = storage => {
  switch (storage) {
    case 'redis':
      return redisQueueStorage;
    default:
      throw new AppError(`This storage doesn't exist`, 404);
  }
};

const queueStorage = selectStorage(config.get('db.types.queue'));

const getQueue = async () => await queueStorage.getQueue();

const enqueue = async body => {
  const newPatientId = body.patientId;

  // checking if the patientId is already in the queue
  const queue = await getQueue();

  const duplicate = queue.some(patient => patient === `${newPatientId}`);

  if (duplicate) {
    throw new ModelConflictError('You are already in the queue');
  }

  await queueStorage.enqueue(newPatientId);

  return { patientId: +newPatientId };
};

const peek = async () => {
  const patientId = await queueStorage.peek();

  if (!patientId) {
    return undefined;
  }

  return { patientId: +patientId };
};

const dequeue = async () => {
  const deletedPatientId = await queueStorage.dequeue();

  if (!deletedPatientId) {
    return undefined;
  }

  return { patientId: +deletedPatientId };
};

export default { getQueue, enqueue, peek, dequeue };
