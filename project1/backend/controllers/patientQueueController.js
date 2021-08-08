const queue = require('../models/patientQueueModel.js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.queuePatient = catchAsync(async (req, res, next) => {
  const newPatient = await queue.enqueue(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      patient: newPatient,
    },
  });
});

exports.getPatient = catchAsync(async (req, res, next) => {
  const patient = await queue.peek(req.params.id);

  if (!patient) {
    return next(
      new AppError('There is no patient with such Queue number.', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      patient,
    },
  });
});

exports.dequeuePatient = catchAsync(async (req, res, next) => {
  const patient = await queue.dequeue(req.params.id);

  if (!patient) {
    return next(
      new AppError('There is no patient with such Queue number.', 404)
    );
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
