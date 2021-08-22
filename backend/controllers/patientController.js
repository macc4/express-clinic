import { StatusCodes } from 'http-status-codes';

import clinicFactory from '../services/factory.js';
import { AppError } from '../utils/errorClasses.js';
import catchAsync from '../utils/catchAsync.js';

const patientService = clinicFactory.getPatientService;

const createPatient = catchAsync(async (req, res, next) => {
  const newPatient = await patientService.createPatient(req.body);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      patient: newPatient,
    },
  });
});

// not used in our project
const getPatient = catchAsync(async (req, res, next) => {
  const patient = await patientService.getPatient(req.params.patientId);

  if (!patient) {
    return next(new AppError('No patient found with that ID', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      patient: patient,
    },
  });
});

const getAllPatients = catchAsync(async (req, res, next) => {
  const patients = await patientService.getAllPatients(req.query);

  if (patients.length === 0 || patients === undefined) {
    return next(new AppError('No patients found', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      patients,
    },
  });
});

// not used in our project
const deletePatient = catchAsync(async (req, res, next) => {
  const deletedPatient = await patientService.deletePatient(req.params.patientId);

  if (deletedPatient === 0 || deletedPatient === undefined) {
    return next(new AppError('No patient found with that ID', 404));
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});

export default { createPatient, getPatient, getAllPatients, deletePatient };
