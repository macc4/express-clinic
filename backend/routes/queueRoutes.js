import express from 'express';
import queueController from '../controllers/queueController.js';

const router = express.Router();

router
  .route('/')
  .post(queueController.enqueue)
  .get(queueController.peek)
  .delete(queueController.dequeue);

export default router;
