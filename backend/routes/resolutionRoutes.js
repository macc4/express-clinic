import express from 'express';
import resolutionController from '../controllers/resolutionController.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(resolutionController.createResolution)
  .get(resolutionController.getAllResolutionsForThePatient)
  .delete(resolutionController.deleteAllResolutionsForThePatient);

router.route('/:resolutionId').get(resolutionController.getResolutionById); // not used in our project

export default router;
