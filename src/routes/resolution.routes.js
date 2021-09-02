import express from 'express';
import authController from '../controllers/auth.controller.js';
import resolutionController from '../controllers/resolution.controller.js';

const router = express.Router({ mergeParams: true });

// for registered users only
router.use(authController.protect);

router
  .route('/')
  .post(
    resolutionController.setPatientId,
    resolutionController.createResolution,
  )
  .get(
    resolutionController.setPatientId,
    resolutionController.getAllResolutions,
  );

router
  .route('/:resolutionId')
  .get(resolutionController.getResolution)
  .delete(resolutionController.deleteResolution);

export default router;
