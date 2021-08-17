import express from 'express';
import morgan from 'morgan';
import path from 'path';
import Router from './routes/routes.js';

const __dirname = path.resolve();

const app = express();

// 1) MIDDLEWARES

app.use(morgan('dev'));

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 2) ROUTES

app.use('/', Router);

app.all('*', (req, res) => {
  res.redirect('/patient');
});

export default app;
