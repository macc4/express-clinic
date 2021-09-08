import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import factory from './handler.factory.js';
import catchAsync from '../utils/catchAsync.js';
import { AppError } from '../utils/errorClasses.js';
import patientService from '../services/patient.service.js';

const getMe = catchAsync(async (req, res, next) => {
  const data = await patientService.getByUserID(req.user.id);

  if (!data) {
    return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  req.params.patientId = data.id;
  next();
});

const createPatient = factory.createOne(patientService);
const getAllPatients = factory.getAll(patientService);
const getPatientByID = factory.getByID(patientService);
const deletePatientByID = factory.deleteByID(patientService);

// for queue
const getAndSetPatientIDFromUser = catchAsync(async (req, res, next) => {
  if (!req.body.patientId) {
    const data = await patientService.getByUserID(req.user.id);

    if (!data) {
      return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
    }

    req.body.patientId = data.id;
  }
  next();
});

export default {
  getMe,
  createPatient,
  getAllPatients,
  getPatientByID,
  deletePatientByID,
  getAndSetPatientIDFromUser,
};
