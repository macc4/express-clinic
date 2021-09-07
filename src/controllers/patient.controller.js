import factory from './handler.factory.js';
import patientService from '../services/patient.service.js';

const createPatient = factory.createOne(patientService);
const getPatientByID = factory.getByID(patientService);
const getAllPatients = factory.getAll(patientService);
const deletePatientByID = factory.deleteByID(patientService);

export default {
  createPatient,
  getPatientByID,
  getAllPatients,
  deletePatientByID,
};
