const patientModel = require('../models/patientModel.js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createPatient = catchAsync(async (req, res, next) => {
  const newPatient = await patientModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      patient: newPatient,
    },
  });
});

exports.getPatient = catchAsync(async (req, res, next) => {
  const patient = await patientModel.get(req.params.id);

  if (!patient) {
    return next(new AppError('No patient found with that name.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      patient,
    },
  });
});

exports.updatePatient = catchAsync(async (req, res, next) => {
  const patient = await patientModel.update(req.params.id, req.body);

  if (!patient) {
    return next(new AppError('No patient found with that name.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      patient,
    },
  });
});

exports.deletePatient = catchAsync(async (req, res, next) => {
  const patient = await patientModel.delete(req.params.id);

  if (!patient) {
    return next(new AppError('No patient found with that name.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
