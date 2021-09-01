import express from 'express';
// import authController from '../controllers/auth.controller.js';
import resolutionController from '../controllers/resolution.controller.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    // authController.protect,
    resolutionController.setPatientId,
    resolutionController.createResolution,
  )
  .get(
    // authController.protect,
    resolutionController.setPatientId,
    resolutionController.getAllResolutions,
  );

router
  .route('/:resolutionId')
  .get(
    // authController.protect,
    resolutionController.getResolution,
  )
  .delete(
    // authController.protect,
    resolutionController.deleteResolution,
  );

export default router;
