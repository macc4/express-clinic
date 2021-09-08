import { ReasonPhrases, StatusCodes } from 'http-status-codes';
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

// for queue
const getAndSetPatientIDFromUser = catchAsync(async (req, res, next) => {
  if (!req.body.patientId) {
    const data = await patientService.getByUserID(req.user.id);

    if (!data) {
      return next(
        new AppError(
          'You do not have a patient account corresponding to your user!',
          StatusCodes.NOT_FOUND,
        ),
      );
    }

    req.body.patientId = data.id;
  }
  next();
});

const createPatient = catchAsync(async (req, res, next) => {
  const patient = await patientService.create(req.body);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      patient,
    },
  });
});

const getAllPatients = catchAsync(async (req, res, next) => {
  const patients = await patientService.getAll(req.query);

  if (patients.length === 0) {
    return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    results: patients.length,
    data: {
      patients,
    },
  });
});

const getPatientByID = catchAsync(async (req, res, next) => {
  const data = await patientService.getByID(req.params.patientId);

  if (!data) {
    return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      data: data,
    },
  });
});

const deletePatientByID = catchAsync(async (req, res, next) => {
  const data = await patientService.deleteByID(req.params.patientId);

  if (!data) {
    return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});

export default {
  getMe,
  createPatient,
  getAllPatients,
  getPatientByID,
  deletePatientByID,
  getAndSetPatientIDFromUser,
};
