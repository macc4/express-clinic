import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { AppError } from '../utils/errorClasses.js';
import catchAsync from '../utils/catchAsync.js';

const createOne = Service =>
  catchAsync(async (req, res, next) => {
    // for nested patient/:id/resolution routes
    if (!req.body.patientId && req.params.patientId)
      req.body.patientId = +req.params.patientId;

    const data = await Service.createOne(req.body);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        data: data,
      },
    });
  });

const getAll = Service =>
  catchAsync(async (req, res, next) => {
    // for nested patient/:id/resolution routes
    if (req.params.patientId) req.query.patientId = +req.params.patientId;

    const data = await Service.getAll(req.query);

    if (data.length === 0) {
      return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      results: data.length,
      data: {
        data,
      },
    });
  });

const getOne = Service =>
  catchAsync(async (req, res, next) => {
    const data = await Service.getOne(req.params);

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

const deleteOne = Service =>
  catchAsync(async (req, res, next) => {
    const data = await Service.deleteOne(req.params);

    if (!data) {
      return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      data: null,
    });
  });

export default { createOne, getOne, getAll, deleteOne };
