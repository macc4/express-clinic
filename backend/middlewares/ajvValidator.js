import { StatusCodes } from 'http-status-codes';

import Ajv from 'ajv';

import AppError from '../utils/appError.js';

const ajv = new Ajv();

const ajvParseErrorLog = (error) => {
  const errorPath = error.instancePath;
  const variableName = errorPath.substring(1);

  const errorMessage = error.message;

  if (variableName === '') {
    return `ValidationError: ${errorMessage}`;
  }

  return `ValidationError: field '${variableName}' ${errorMessage}`;
};

export default (body, schema) => {
  const validateEnqueueSchema = ajv.compile(schema);
  const valid = validateEnqueueSchema(body);

  if (!valid) {
    const validationErrors = ajvParseErrorLog(validateEnqueueSchema.errors[0]);
    throw new AppError(validationErrors, StatusCodes.BAD_REQUEST);
  }
};
