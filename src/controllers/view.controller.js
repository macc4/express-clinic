import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';

import resolutionService from '../services/resolution.service.js';
import queueService from '../services/queue.service.js';
import patientService from '../services/patient.service.js';
import doctorService from '../services/doctor.service.js';

const getQueueAsDoctor = catchAsync(async (req, res) => {
  const queue = {};
  queue.current = null;

  const doctorId = req.user.doctorId;
  const currentPatientId = await queueService.peek(doctorId);

  if (currentPatientId) {
    const { patientId } = currentPatientId;
    const { name } = await patientService.getByID(patientId);

    if (name) {
      queue.current = name;
    }
  }

  res.status(StatusCodes.OK).render('queue', {
    title: 'Queue',
    queue,
  });
});

const getQueue = catchAsync(async (req, res, next) => {
  const queue = {};

  if (req.user && req.user.doctorId) {
    return await getQueueAsDoctor(req, res);
  }

  const doctors = await doctorService.getAll();

  res.status(StatusCodes.OK).render('queue', {
    title: 'Queue',
    queue,
    doctors,
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

const getDoctorSigninForm = (req, res) => {
  res.status(StatusCodes.OK).render('doctorSignIn', {
    title: "Doctor's authorization",
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
  getDoctorSigninForm,
  getSignupForm,
  getAllResolutionsByName,
};
