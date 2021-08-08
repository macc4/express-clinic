const AppError = require('../utils/appError');
const Ajv = require('ajv');

const ajv = new Ajv();

class Queue {
  constructor() {
    this.patients = [];
    this.patientQueueSchema = {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 20 },
        timeToLive: { type: 'integer' },
      },
      required: ['name'],
      additionalProperties: false,
    };
  }

  get size() {
    return this.patients.length;
  }

  get isEmpty() {
    return this.size === 0;
  }

  enqueue(body) {
    const validateEnqueueSchema = ajv.compile(this.patientQueueSchema);
    const valid = validateEnqueueSchema(body);

    if (!valid) throw new AppError('Data is bad.', 404);

    const { name, timeToLive } = body;

    // <--- MOVE TO MIDDLEWARE
    const duplicatePatient = this.patients.some(
      (patient) => patient.name === name.toLowerCase()
    );

    if (duplicatePatient) {
      throw new AppError('You are already in the queue.', 404);
    }

    // --->

    const currentTime = new Date();

    if (timeToLive === '') {
      const patient = {
        ...this.patientQueueSchema,
        name: name.toLowerCase(),
      };
      this.patients.push(patient);
    } else {
      const patient = {
        name: name.toLowerCase(),
        expiry: currentTime.getTime() + timeToLive * 60 * 1000,
      };
      this.patients.push(patient);
    }
  }

  peek(id) {
    return this.patients[id - 1];
  }

  dequeue(id) {
    const deletedPatient = this.patients[id - 1];
    this.patients.splice(id - 1, 1);
    return deletedPatient;
  }
}

const queue = new Queue();

module.exports = queue;
