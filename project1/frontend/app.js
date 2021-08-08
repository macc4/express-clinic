const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/AppError.js');

const Router = require('./routes/routes.js');

const app = express();

// 1) MIDDLEWARES

app.use(morgan('dev'));

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 2) ROUTES

app.use('/', Router);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
