import express from 'express';
import authController from '../controllers/auth.controller.js';
import patientController from '../controllers/patient.controller.js';

const router = express.Router();

router
  .route('/')
  .post(authController.protect, patientController.createPatient)
  .get(authController.protect, patientController.getAllPatients);

router
  .route('/:patientId')
  .get(authController.protect, patientController.getPatient)
  .delete(authController.protect, patientController.deletePatient);

export default router;
