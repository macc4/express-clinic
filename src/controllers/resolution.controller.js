import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import resolutionService from '../services/resolution.service.js';
import { AppError } from '../utils/errorClasses.js';
import catchAsync from '../utils/catchAsync.js';

// middleware for nested "patient/:patientId/resolution" routes
const setPatientIDFromParams = (req, res, next) => {
  // for create function
  if (Object.keys(req.body).length && !req.body.patientId) {
    req.body.patientId = +req.params.patientId;
  }

  // for getAll function (so we won't populate req.query with unnecessary data when posting)
  if (!Object.keys(req.body).length && req.params.patientId) {
    req.query.patientId = +req.params.patientId;
  }

  next();
};

const getResolutionsByUserID = catchAsync(async (req, res, next) => {
  const resolutions = await resolutionService.getByUserID(req.user.id);

  if (resolutions.length === 0) {
    return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    results: resolutions.length,
    data: {
      resolutions,
    },
  });
});

const createResolution = catchAsync(async (req, res, next) => {
  const resolution = await resolutionService.create(req.body);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      resolution,
    },
  });
});

const getAllResolutions = catchAsync(async (req, res, next) => {
  // basically a workaround to implement a search by patientName while maintaining REST route structure
  let resolutions;

  if (req.body.name) {
    resolutions = await resolutionService.getByPatientName(req.body.name);
  } else {
    resolutions = await resolutionService.getAll(req.query);
  }

  if (resolutions.length === 0) {
    return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    results: resolutions.length,
    data: {
      resolutions,
    },
  });
});

const getResolutionByID = catchAsync(async (req, res, next) => {
  const data = await resolutionService.getByID(req.params.resolutionId);

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

const deleteResolutionByID = catchAsync(async (req, res, next) => {
  const data = await resolutionService.deleteByID(req.params.resolutionId);

  if (!data) {
    return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});

export default {
  createResolution,
  getAllResolutions,
  getResolutionByID,
  deleteResolutionByID,
  setPatientIDFromParams,
  getResolutionsByUserID,
};
