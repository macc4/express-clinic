import db from '../../db/memory.js';
import { ModelConflictError } from '../../utils/errorClasses.js';

let { queue } = db;

export default class QueueInMemoryService {
  enqueue(body) {
    // checking if the patient is already in the queue
    const duplicatePatient = queue.some(
      (patient) => patient === body.patientId
    );

    if (duplicatePatient) {
      throw new ModelConflictError('You are already in the queue');
    }

    queue.push(body.patientId);
    return { patientId: body.patientId };
  }

  peek() {
    const patient = queue[0];

    if (!patient) {
      return undefined;
    }

    return { patientId: patient };
  }

  dequeue() {
    const deletedPatient = queue.shift();

    if (!deletedPatient) {
      return undefined;
    }

    return { patientId: deletedPatient };
  }
}
