import { StatusCodes } from 'http-status-codes';

import clinicFactory from '../services/factory.js';
import { AppError } from '../utils/errorClasses.js';
import catchAsync from '../utils/catchAsync.js';

const resolutionService = clinicFactory.getResolutionService;

const createResolution = catchAsync(async (req, res, next) => {
  const newResolution = await resolutionService.createResolution(
    req.body,
    req.params
  );

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      resolution: newResolution,
    },
  });
});

// not used in our project
const getResolutionById = catchAsync(async (req, res, next) => {
  const resolution = await resolutionService.getResolutionById(
    req.params.resolutionId
  );

  if (!resolution) {
    return next(
      new AppError('No resolution found with that ID', StatusCodes.NOT_FOUND)
    );
  }

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      resolution: resolution,
    },
  });
});

const getAllResolutionsForThePatient = catchAsync(async (req, res, next) => {
  const resolutions = await resolutionService.getAllResolutionsForThePatient(
    req.params.patientId
  );

  if (resolutions.length === 0 || !resolutions) {
    return next(
      new AppError(
        'No resolutions found for that patient',
        StatusCodes.NOT_FOUND
      )
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      resolutions,
    },
  });
});

const deleteAllResolutionsForThePatient = catchAsync(async (req, res, next) => {
  const resolutions = await resolutionService.deleteAllResolutionsForThePatient(
    req.params.patientId
  );

  if (!resolutions || resolutions.length === 0) {
    return next(new AppError('No resolutions found for that patient', 404));
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});

export default {
  createResolution,
  getResolutionById,
  getAllResolutionsForThePatient,
  deleteAllResolutionsForThePatient,
};
