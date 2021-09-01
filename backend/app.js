import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

import { StatusCodes } from 'http-status-codes';
import errorController from './src/controllers/error.controller.js';
import { AppError } from './src/utils/errorClasses.js';

import userRoutes from './src/routes/user.routes.js';
import patientRoutes from './src/routes/patient.routes.js';
import resolutionRoutes from './src/routes/resolution.routes.js';

const app = express();

// 1) MIDDLEWARES

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 2) ROUTES

const swaggerJsDocs = YAML.load('./api-docs.yml');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/resolutions', resolutionRoutes);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find the ${req.originalUrl} route on this server!`,
      StatusCodes.NOT_FOUND,
    ),
  );
});

// 3) ERROR HANDLING

app.use(errorController);

export default app;
