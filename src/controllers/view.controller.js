import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';

import resolutionService from '../services/resolution.service.js';
import queueService from '../services/queue.service.js';
import patientService from '../services/patient.service.js';
import doctorService from '../services/doctor.service.js';
import Roles from '../utils/roles.js';
import SELECTED_DOCTOR from '../../public/js/doctorInit.js';

const getQueueByDoctor = catchAsync(async (req, res) => {
  const { doctorId } = req.user;
  const queue = await getQueue(doctorId);

  res.status(StatusCodes.OK).render('queue', {
    title: 'Queue',
    queue,
  });
});

const getQueueAndDoctors = catchAsync(async (req, res) => {
  let selectedDoctor = SELECTED_DOCTOR;

  if (req.params && req.params.doctorId) {
    selectedDoctor = req.params.doctorId;
  }
  console.log('getQueueAndDoctors selectedDoctor', selectedDoctor)

  const queue = await getQueue(selectedDoctor);

  const doctors = await doctorService.getAll();

  res.status(StatusCodes.OK).render('queue', {
    title: 'Queue',
    queue,
    doctors,
    selectedDoctor,
  });
});

const getQueue = async doctorId => {
  const queue = {};
  queue.current = null;

  if (!doctorId) return queue;

  const currentPatientId = await queueService.peek(doctorId);

  if (currentPatientId) {
    const { patientId } = currentPatientId;
    const { name } = await patientService.getByID(patientId);

    if (name) {
      queue.current = name;
    }
  }
  return queue;
};

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

const getForm = (req, res, next) => {
  if (!req.user) {
    return getSigninForm(req, res);
  }
  if (req.user['roles.id'] === Roles.PATIENT) {
    return getQueueAndDoctors(req, res, next);
  }
  return getQueueByDoctor(req, res, next);
};

export default {
  getQueue,
  getQueueByDoctor,
  getQueueAndDoctors,
  getPersonalResolutions,
  getSigninForm,
  getDoctorSigninForm,
  getSignupForm,
  getAllResolutionsByName,
  getForm,
};
