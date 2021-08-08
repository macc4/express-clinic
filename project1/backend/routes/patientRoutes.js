const express = require('express');
const patientController = require('../controllers/patientController.js');

const router = express.Router();

router.route('/').post(patientController.createPatient);
//.get(patientsController.getAllPatients)

router
  .route('/:id')
  .get(patientController.getPatient)
  .patch(patientController.updatePatient)
  .delete(patientController.deletePatient);

module.exports = router;
