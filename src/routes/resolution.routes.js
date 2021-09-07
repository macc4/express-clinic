import express from 'express';
import authController from '../controllers/auth.controller.js';
import resolutionController from '../controllers/resolution.controller.js';

const router = express.Router({ mergeParams: true });

// for registered users only
router.use(authController.protect);

router
  .route('/')
  .post(
    resolutionController.setPatientID,
    resolutionController.createResolution,
  )
  .get(
    resolutionController.setPatientID,
    resolutionController.getAllResolutions,
  );

router
  .route('/:resolutionId')
  .get(resolutionController.getResolutionByID)
  .delete(resolutionController.deleteResolutionByID);

export default router;
