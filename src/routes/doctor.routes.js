import express from 'express';
import doctorController from '../controllers/doctor.controller.js';

const router = express.Router();

router.get('/me', doctorController.getMe, doctorController.getDoctorByID);

router.get('/', doctorController.getAllDoctors);

router.get('/:doctorId', doctorController.getDoctorByID);

export default router;
