import express from 'express';
import path from 'path';
const __dirname = path.resolve();

const router = express.Router();

router.get('/patient', (req, res) => {
  res.sendFile(path.join(__dirname, './html', 'patient.html'));
});

router.get('/doctor', (req, res) => {
  res.sendFile(path.join(__dirname, './html', 'doctor.html'));
});

export default router;
