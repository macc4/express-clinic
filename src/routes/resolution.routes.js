import express from 'express';
import authController from '../controllers/auth.controller.js';
import resolutionController from '../controllers/resolution.controller.js';
import Roles from '../utils/roles.js';

const router = express.Router({ mergeParams: true });

// for registered users only
router.use(authController.protect);

router.get(
  '/personal',
  authController.restrictTo(Roles.PATIENT),
  resolutionController.getResolutionsByUserID,
);

router
  .route('/')
  .post(
    authController.restrictTo(Roles.DOCTOR),
    resolutionController.setPatientIDFromParams,
    resolutionController.createResolution,
  )
  .get(
    authController.restrictTo(Roles.DOCTOR),
    resolutionController.setPatientIDFromParams,
    resolutionController.getAllResolutions,
  );

router
  .route('/:resolutionId')
  .get(resolutionController.getResolutionByID)
  .delete(
    authController.restrictTo(Roles.DOCTOR),
    resolutionController.setPatientIDFromParams,
    resolutionController.deleteResolutionByID,
  );

export default router;
