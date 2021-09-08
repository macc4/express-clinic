import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';
import resolutionService from '../services/resolution.service.js';
import queueService from '../services/queue.service.js';
import patientService from '../services/patient.service.js';
import db from '../db/clients/sequelize.client.js';

// view controller needs adjustments, since we are working directly with sequelize here, when we should work with services
const getQueue = catchAsync(async (req, res, next) => {
  const currentPatientId = await queueService.peek();

  const queue = {};

  req.params.patientId = currentPatientId;

  const currentPatient = await patientService.getByID(req.params);

  // needs adjustments, since name is now being stored in the patient entity
  if (currentPatient) {
    queue.current = currentPatient.name;
    if (req.user) {
      queue.userPatientId = currentPatientId;
    }
  }

  res.status(StatusCodes.OK).render('queue', {
    title: 'Queue',
    queue: queue,
  });
});

const getPersonalResolutions = catchAsync(async (req, res, next) => {
  const patient = db.users.findOne({
    where: { userId: req.user.id },
  });

  req.query.patientId = patient.id;

  const resolutions = await resolutionService.getAll(req.query);

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
};
