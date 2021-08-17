import { StatusCodes } from 'http-status-codes';
import ajvValidator from '../middlewares/ajvValidator.js';
import resolutionModel from '../models/resolutionFactory.js';
import resolutionSchema from '../schemas/resolutionSchema.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import errorMessages from '../lib/errorMessages.js';

const createResolution = catchAsync(async (req, res, next) => {
  ajvValidator(req.body, resolutionSchema);

  const newPatient = await resolutionModel.create(req.body);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      patient: newPatient,
    },
  });
});

const getResolutions = catchAsync(async (req, res, next) => {
  const patient = await resolutionModel.get(req.query.patient); // double-check this part

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

const deleteResolution = catchAsync(async (req, res, next) => {
  const patient = await resolutionModel.delete(req.params.name);

  if (!patient) {
    return next(new AppError(errorMessages.NOT_FOUND_DATA, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});

export default { createResolution, getResolutions, deleteResolution };
