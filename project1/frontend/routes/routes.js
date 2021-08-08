const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/patient', (req, res) => {
  res.sendFile(path.join(__dirname, '../html', 'patient.html'));
});

router.get('/doctor', (req, res) => {
  res.sendFile(path.join(__dirname, '../html', 'doctor.html'));
});

module.exports = router;
