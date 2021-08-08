const express = require('express');
const patientQueueController = require('../controllers/patientQueueController.js');

const router = express.Router();

router.route('/').post(patientQueueController.queuePatient);

router
  .route('/:id')
  .get(patientQueueController.getPatient)
  .delete(patientQueueController.dequeuePatient);

module.exports = router;
