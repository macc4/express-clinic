import express from 'express';
import resolutionController from '../controllers/resolutionController.js';

import ajvValidator from '../middlewares/ajvValidator.js';
import resolutionSchema from '../middlewares/schemas/resolutionSchema.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    ajvValidator('body', resolutionSchema),
    resolutionController.createResolution
  )
  .get(resolutionController.getAllResolutionsForThePatient)
  .delete(resolutionController.deleteAllResolutionsForThePatient);

router.route('/:resolutionId').get(resolutionController.getResolutionById); // not used in our project

export default router;
