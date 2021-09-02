import express from 'express';
import queueController from '../controllers/queue.controller.js';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router
  .route('/')
  .post(
    authController.protect,
    // authController.restrictTo('doctor', 'admin'),
    queueController.enqueue,
  )
  .get(queueController.peek)
  .delete(
    authController.protect,
    // authController.restrictTo('doctor', 'admin'),
    queueController.dequeue,
  );

export default router;
