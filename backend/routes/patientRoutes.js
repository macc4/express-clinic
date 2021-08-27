import express from 'express';

import patientController from '../controllers/patientController.js';
import resolutionRoutes from './resolutionRoutes.js';

import ajvValidator from '../middlewares/ajvValidator.js';
import patientSchema from '../middlewares/schemas/patientSchema.js';

const router = express.Router();

router
  .route('/')
  .post(ajvValidator('body', patientSchema), patientController.createPatient)
  .get(patientController.getAllPatients); // used to perform search by name

router
  .route('/:patientId')
  .get(patientController.getPatient)
  .delete(patientController.deletePatient); // not used in our project

router.use('/:patientId/resolutions/', resolutionRoutes);

export default router;
