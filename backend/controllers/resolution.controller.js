import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errorClasses.js';
import catchAsync from '../utils/catchAsync.js';

import resolutionService from '../services/resolution.service.js';

const createResolution = catchAsync(async (req, res, next) => {
  const data = await resolutionService.createOne(req.body);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      data: data,
    },
  });
});

const getResolution = catchAsync(async (req, res, next) => {
  const data = await resolutionService.getOne(req.params.resolutionId);

  if (!data) {
    const statusCode = StatusCodes.NOT_FOUND;
    return next(new AppError('Resolution not found', statusCode));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      data: data,
    },
  });
});

const getAllResolutions = catchAsync(async (req, res, next) => {
  const data = await resolutionService.getAll(req.query);

  if (data.length === 0) {
    const statusCode = StatusCodes.NOT_FOUND;
    return next(new AppError('Resolutions not found', statusCode));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      data,
    },
  });
});

const deleteResolution = catchAsync(async (req, res, next) => {
  const data = await resolutionService.deleteOne(req.params.resolutionId);

  if (!data) {
    const statusCode = StatusCodes.NOT_FOUND;
    return next(new AppError('Resolution not found', statusCode));
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});

export default {
  createResolution,
  getResolution,
  getAllResolutions,
  deleteResolution,
};
