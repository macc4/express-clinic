const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const patientQueueRoutes = require('./routes/patientQueueRoutes.js');
const patientRoutes = require('./routes/patientRoutes.js');

const app = express();

// TODO: TTL filtering

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/queue/patients', patientQueueRoutes);
app.use('/api/v1/database/patients', patientRoutes);

app.use('*', (req, res) => res.status(404).json({ error: 'not found' }));

module.exports = app;
