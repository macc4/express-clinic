import { ModelConflictError } from '../utils/errorClasses.js';
import errorMessages from '../lib/errorMessages.js';
import { capitalizeNameFromRegularCase } from '../utils/bodyDecorator.js';
import { db } from '../db/in-memory.js';

let { queue } = db;

export class QueueInMemoryModel {
  enqueue(body) {
    let { name } = body;
    const newPatient = capitalizeNameFromRegularCase(name.toLowerCase());

    // checking if the patient is already in the queue
    const duplicatePatient = queue.some((patient) => patient === newPatient);

    if (duplicatePatient) {
      throw new ModelConflictError(errorMessages.CONFLICT);
    }

    queue.push(newPatient);
    return { name: newPatient };
  }

  peek() {
    const patient = queue[0];

    if (!patient) {
      return undefined;
    }

    return { name: patient };
  }

  dequeue() {
    const deletedPatient = queue.shift();

    if (!deletedPatient) {
      return undefined;
    }

    return { name: deletedPatient };
  }
}
