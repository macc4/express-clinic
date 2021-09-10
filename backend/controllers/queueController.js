import { StatusCodes } from 'http-status-codes';

import clinicFactory from '../services/factory.js';
import { AppError } from '../utils/errorClasses.js';
import catchAsync from '../utils/catchAsync.js';

const queueService = clinicFactory.getQueueService;

const enqueue = catchAsync(async (req, res, next) => {
  const newPatient = await queueService.enqueue(req.body);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      patient: newPatient,
    },
  });
});

const peek = catchAsync(async (req, res, next) => {
  const patient = await queueService.peek();

  if (!patient) {
    return next(
      new AppError('There are no patients in the queue', StatusCodes.NOT_FOUND)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      patient: patient,
    },
  });
});

const dequeue = catchAsync(async (req, res, next) => {
  const patient = await queueService.dequeue();

  if (patient === undefined) {
    return next(
      new AppError('There are no patients in the queue', StatusCodes.NOT_FOUND)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: null,
  });
});

export default { enqueue, peek, dequeue };
