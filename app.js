import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import { StatusCodes } from 'http-status-codes';
import errorController from './src/controllers/error.controller.js';
import { AppError } from './src/utils/errorClasses.js';

import viewRoutes from './src/routes/view.routes.js';
import queueRoutes from './src/routes/queue.routes.js';
import userRoutes from './src/routes/user.routes.js';
import patientRoutes from './src/routes/patient.routes.js';
import resolutionRoutes from './src/routes/resolution.routes.js';
import doctorRoutes from './src/routes/doctor.routes.js';

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(path.resolve(), 'src/views'));

// 1) GLOBAL MIDDLEWARES

app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 2) ROUTES.

// 2.1) FRONT-END ROUTES

app.use('/', viewRoutes);

// 2.2) API ROUTES

app.use('/api/v1/queue', queueRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/resolutions', resolutionRoutes);
app.use('/api/v1/doctors', doctorRoutes);

// 2.3) NOT FOUND ROUTE

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
