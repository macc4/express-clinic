import { StatusCodes } from 'http-status-codes';
import queueModel from '../models/queueFactory.js';
import catchAsync from '../utils/catchAsync.js';
import { AppError } from '../utils/errorClasses.js';
import errorMessages from '../lib/errorMessages.js';

const enqueuePatient = catchAsync(async (req, res, next) => {
  const newPatient = await queueModel.enqueue(req.body);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      patient: newPatient,
    },
  });
});

const getPatient = catchAsync(async (req, res, next) => {
  const patient = await queueModel.peek();

  if (!patient) {
    return next(new AppError(errorMessages.NOT_FOUND_DATA, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      patient,
    },
  });
});

const dequeuePatient = catchAsync(async (req, res, next) => {
  const patient = await queueModel.dequeue();

  if (!patient) {
    return next(new AppError(errorMessages.NOT_FOUND_DATA, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});

export default { enqueuePatient, getPatient, dequeuePatient };
