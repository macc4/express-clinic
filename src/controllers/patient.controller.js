import factory from './handler.factory.js';
import patientService from '../services/patient.service.js';

const createPatient = factory.createOne(patientService);
const getPatient = factory.getOne(patientService);
const getAllPatients = factory.getAll(patientService);
const deletePatient = factory.deleteOne(patientService);

export default { createPatient, getPatient, getAllPatients, deletePatient };
