/*eslint max-classes-per-file: "off"*/
import { StatusCodes } from 'http-status-codes';

// TODO create a separate handler for sequelize validation errors

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ModelConflictError extends Error {
  constructor(message) {
    super(message);

    this.name = 'ConflictError';
    this.statusCode = StatusCodes.CONFLICT;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
class ValidationError extends Error {
  constructor(message) {
    super(message);

    this.name = 'ValidationError';
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError, ModelConflictError, ValidationError };
