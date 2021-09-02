import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';
import resolutionService from '../services/resolution.service.js';
import queueService from '../services/queue.service.js';
import db from '../db/sequelize.js';

const getQueue = catchAsync(async (req, res, next) => {
  const currentPatient = await queueService.peek();

  const queue = {};
  if (currentPatient) {
    const currentUser = await db.users.findOne({
      where: { patientId: currentPatient.patientId },
    });

    queue.current = currentUser.name;
  }

  res.status(StatusCodes.OK).render('queue', {
    title: 'Queue',
    // user: { name: 'Aleksei Leonenko', role: 'admin' },
    queue: queue,
  });
});

const getPersonalResolutions = catchAsync(async (req, res, next) => {
  req.query.patientId = req.user.patientId;

  const resolutions = await resolutionService.getAll(req.query);

  res.status(StatusCodes.OK).render('resolutions', {
    title: 'Resolutions',
    // user: { name: 'Aleksei Leonenko', role: 'admin' },
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
