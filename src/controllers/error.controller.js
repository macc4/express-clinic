import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import config from 'config';

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // API ERROR RESPONSE
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // RENDERED WEBSITE ERROR RESPONSE

    if (err.message === 'jwt malformed') {
      err.statusCode = StatusCodes.UNAUTHORIZED;
      err.message = 'You are not logged in!';
    }

    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      code: err.statusCode,
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // Operational error, send the message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other error, not sending anything to the client
  } else {
    // 1) Log error
    console.error('ERROR', err); // eslint-disable-line no-console

    // 2) Send a generic message
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  if (config.get('error.shortLog')) {
    sendErrorProd(err, req, res);
  } else {
    sendErrorDev(err, req, res);
  }
};
