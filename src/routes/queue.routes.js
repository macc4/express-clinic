import express from 'express';
import queueController from '../controllers/queue.controller.js';
import patientController from '../controllers/patient.controller.js';
import doctorController from '../controllers/doctor.controller.js';
import authController from '../controllers/auth.controller.js';
import Roles from '../utils/roles.js';

const router = express.Router();

// doctor
router
  .route('/')
  .get(
    authController.restrictTo(Roles.DOCTOR),
    doctorController.getMe,
    queueController.peek,
  )
  .delete(
    authController.protect,
    authController.restrictTo(Roles.DOCTOR),
    doctorController.getMe,
    queueController.dequeue,
  );

// patient
router
  .route('/:doctorId')
  .get(authController.restrictTo(Roles.PATIENT), queueController.peek)
  .post(
    authController.protect,
    authController.restrictTo(Roles.PATIENT),
    patientController.getAndSetPatientIDFromUser,
    queueController.enqueue,
  );

export default router;
