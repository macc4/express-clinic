import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { AppError } from '../utils/errorClasses.js';
import catchAsync from '../utils/catchAsync.js';

const createOne = Service =>
  catchAsync(async (req, res, next) => {
    const data = await Service.create(req.body);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        data: data,
      },
    });
  });

const getAll = Service =>
  catchAsync(async (req, res, next) => {
    // TODO add proper query middleware for limit offset etc

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

const getByID = Service =>
  catchAsync(async (req, res, next) => {
    const data = await Service.getByID(req.params);

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

const deleteByID = Service =>
  catchAsync(async (req, res, next) => {
    const data = await Service.deleteByID(req.params);

    if (!data) {
      return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      data: null,
    });
  });

export default { createOne, getByID, getAll, deleteByID };
