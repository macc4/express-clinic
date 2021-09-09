import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';

import resolutionService from '../services/resolution.service.js';
import queueService from '../services/queue.service.js';
import patientService from '../services/patient.service.js';

const getQueue = catchAsync(async (req, res, next) => {
  const currentPatientId = await queueService.peek();
  const currentPatient = await patientService.getByID(currentPatientId);

  const queue = {};

  if (currentPatient) {
    queue.current = currentPatient.name;
  }

  res.status(StatusCodes.OK).render('queue', {
    title: 'Queue',
    queue: queue,
  });
});

const getPersonalResolutions = catchAsync(async (req, res, next) => {
  const resolutions = await resolutionService.getByUserID(req.user.id);

  res.status(StatusCodes.OK).render('personalResolutions', {
    title: 'Resolutions',
    resolutions,
  });
});

const getAllResolutionsByName = catchAsync(async (req, res, next) => {
  const resolutions = await resolutionService.getByPatientName(req.query.name);

  res.status(StatusCodes.OK).render('resolutions', {
    title: 'Resolutions',
    resolutions,
  });
});

const getSigninForm = (req, res) => {
  res.status(StatusCodes.OK).render('signin', {
    title: 'Log into your account',
  });
};

const getSignupForm = (req, res) => {
  res.status(StatusCodes.OK).render('signup', {
    title: 'Create your account',
  });
};

export default {
  getQueue,
  getPersonalResolutions,
  getSigninForm,
  getSignupForm,
  getAllResolutionsByName,
};
