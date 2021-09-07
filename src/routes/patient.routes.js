import express from 'express';
import authController from '../controllers/auth.controller.js';
import patientController from '../controllers/patient.controller.js';
import resolutionRouter from './resolution.routes.js';

const router = express.Router();

// for registered users
router.use(authController.protect);

router
  .route('/')
  .post(patientController.createPatient)
  .get(patientController.getAllPatients);

router
  .route('/:patientId')
  .get(patientController.getPatientByID)
  .delete(patientController.deletePatientByID);

// route nesting for the resolution entity
router.use('/:patientId/resolutions', resolutionRouter);

export default router;
