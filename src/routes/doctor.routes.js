import express from 'express';
import authController from '../controllers/auth.controller.js';
import doctorController from '../controllers/doctor.controller.js';
import Roles from '../utils/roles.js';

const router = express.Router();

router.use(authController.protect);

router.get(
  '/me',
  authController.restrictTo(Roles.DOCTOR),
  doctorController.getMe,
  doctorController.getDoctorByID,
);

router.get('/', doctorController.getAllDoctors);

router.get('/:doctorId', doctorController.getDoctorByID);

export default router;
