import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import { StatusCodes } from 'http-status-codes';
import errorController from './controllers/errorController.js';
import { AppError } from './utils/errorClasses.js';

import patientRoutes from './routes/patientRoutes.js';
import queueRoutes from './routes/queueRoutes.js';

// Swagger options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Queue/Resoulution API's",
      version: '0.1.0',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);

const app = express();

// 1) MIDDLEWARES

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 2) ROUTES

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

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
