import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import factory from './handler.factory.js';
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

const createResolution = factory.createOne(resolutionService);
const getAllResolutions = factory.getAll(resolutionService);

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

const getResolutionByID = factory.getByID(resolutionService);
const deleteResolutionByID = factory.deleteByID(resolutionService);

export default {
  createResolution,
  getAllResolutions,
  getResolutionByID,
  deleteResolutionByID,
  setPatientIDFromParams,
  getResolutionsByUserID,
};
