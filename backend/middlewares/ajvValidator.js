import Ajv from 'ajv';

import { ValidationError } from '../utils/errorClasses.js';

const ajv = new Ajv();

const ajvParseErrorLog = (error) => {
  const errorPath = error.instancePath;
  const variableName = errorPath.substring(1);

  const errorMessage = error.message;

  if (variableName === '') {
    return `${errorMessage}`;
  }

  return `field '${variableName}' ${errorMessage}`;
};

export default (property, schema) => {
  return (req, res, next) => {
    const validateEnqueueSchema = ajv.compile(schema);
    const valid = validateEnqueueSchema(req[property]);

    if (!valid) {
      const validationErrors = ajvParseErrorLog(validateEnqueueSchema.errors[0]);
      next(new ValidationError(validationErrors));
    }

    next();
  };
};
