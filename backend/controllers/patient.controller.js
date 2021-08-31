import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errorClasses.js';
import catchAsync from '../utils/catchAsync.js';

import patientService from '../services/patient.service.js';

const createPatient = catchAsync(async (req, res, next) => {
  const data = await patientService.createOne(req.body);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      data: data,
    },
  });
});

const getPatient = catchAsync(async (req, res, next) => {
  const data = await patientService.getOne(req.params.patientId);

  if (!data) {
    const statusCode = StatusCodes.NOT_FOUND;
    return next(new AppError('Patient not found', statusCode));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      data: data,
    },
  });
});

const getAllPatients = catchAsync(async (req, res, next) => {
  const data = await patientService.getAll(req.query);

  if (data.length === 0) {
    const statusCode = StatusCodes.NOT_FOUND;
    return next(new AppError('Patients not found', statusCode));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      data,
    },
  });
});

const deletePatient = catchAsync(async (req, res, next) => {
  const data = await patientService.deleteOne(req.params.patientId);

  if (!data) {
    const statusCode = StatusCodes.NOT_FOUND;
    return next(new AppError('Patient not found', statusCode));
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});

export default { createPatient, getPatient, getAllPatients, deletePatient };
