import express from 'express';
import queueController from '../controllers/queue.controller.js';
import patientController from '../controllers/patient.controller.js';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router
  .route('/')
  .post(
    authController.protect,
    // authController.restrictTo('doctor', 'admin'),
    patientController.getAndSetPatientIDFromUser, // if the patient is signed in, it will get the patientId from the req.user
    queueController.enqueue,
  )
  .get(queueController.peek)
  .delete(
    authController.protect,
    // authController.restrictTo('doctor', 'admin'),
    queueController.dequeue,
  );

export default router;
