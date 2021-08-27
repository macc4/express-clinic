import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

import { StatusCodes } from 'http-status-codes';
import errorController from './controllers/errorController.js';
import { AppError } from './utils/errorClasses.js';

import patientRoutes from './routes/patientRoutes.js';
import queueRoutes from './routes/queueRoutes.js';

const app = express();

// 1) MIDDLEWARES

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 2) ROUTES

const swaggerJsDocs = YAML.load('./api-docs.yaml');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

app.use('/api/v1/queue', queueRoutes);
app.use('/api/v1/patients', patientRoutes);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find the ${req.originalUrl} route on this server!`,
      StatusCodes.NOT_FOUND
    )
  );
});

// 3) ERROR HANDLING

app.use(errorController);

export default app;
