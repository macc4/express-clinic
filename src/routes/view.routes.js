import express from 'express';
import viewController from '../controllers/view.controller.js';
import authController from '../controllers/auth.controller.js';
import doctorController from '../controllers/doctor.controller.js';

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getForm);

router.get('/signin', authController.isLoggedIn, viewController.getSigninForm);

router.get(
  '/doctorSignin',
  authController.isLoggedIn,
  viewController.getDoctorSigninForm,
);

router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);

router.get(
  '/doctor',
  authController.protect,
  authController.isLoggedIn,
  doctorController.getAndSetDoctorIDFromUser,
  viewController.getQueueByDoctor,
);

router.get(
  '/doctor-:doctorId',
  authController.protect,
  authController.isLoggedIn,
  viewController.getQueueAndDoctors,
);

router.get(
  '/personal-resolutions',
  authController.protect,
  authController.isLoggedIn,
  viewController.getPersonalResolutions,
);

router.get(
  '/resolutions',
  authController.protect,
  authController.isLoggedIn,
  viewController.getAllResolutionsByName,
);

export default router;
