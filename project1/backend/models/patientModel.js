const AppError = require('../utils/appError');
const Ajv = require('ajv');

const ajv = new Ajv();

const formatName = require('../utils/formatName.js');

let patients = [];

const patientSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 20 },
    resolution: { type: 'string', maxLength: 400 },
    timeToLive: { type: 'integer' },
  },
  required: ['name'],
  additionalProperties: false,
};

const emptyPatient = {
  id: null,
  name: null,
  resolution: null,
  expiry: null,
};

exports.create = (body) => {
  const validateEnqueueSchema = ajv.compile(patientSchema);
  const valid = validateEnqueueSchema(body);

  if (!valid) throw new AppError('Data is bad.');

  let { name, timeToLive } = body;

  name = formatName(String(name));
  const currentTime = new Date();

  // <--- MOVE TO MIDDLEWARE ?
  const duplicatePatient = patients.some((patient) => patient.name === name);

  if (duplicatePatient) {
    throw new AppError('You are already in the queue.');
  }

  // --->

  const patient = {
    ...emptyPatient,
    id: patients.length > 0 ? patients[patients.length - 1].id + 1 : 1,

    name: name,
    expiry: currentTime.getTime() + timeToLive * 60 * 1000,
  };

  patients.push(patient);
};

exports.get = (name) => {
  name = formatName(String(name));

  return patients.filter((patient) => patient.name === name)[0];
};

exports.update = (name, body) => {
  let { resolution } = body;
  name = formatName(String(name));

  const searchIndex = patients.findIndex((patient) => patient.name === name);

  patients[searchIndex].resolution = resolution;

  return patients[searchIndex];
};

exports.delete = (name) => {
  name = formatName(String(name));

  const deletedPatient = patients.filter((patient) => patient.name === name);

  patients = patients.filter((patient) => patient.name !== name);

  return deletedPatient;
};
