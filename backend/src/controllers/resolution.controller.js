import factory from './handler.factory.js';
import resolutionService from '../services/resolution.service.js';

// middleware for nested "patient/:patientId/resolution" routes
const setPatientId = (req, res, next) => {
  // for create function
  if (!req.body.patientId && req.params.patientId)
    req.body.patientId = +req.params.patientId;

  // for getAll function (so we won't populate req.query with unnecessary data when posting)
  if (!req.body && req.params.patientId)
    req.query.patientId = +req.params.patientId;

  next();
};

const createResolution = factory.createOne(resolutionService);
const getResolution = factory.getOne(resolutionService);
const getAllResolutions = factory.getAll(resolutionService);
const deleteResolution = factory.deleteOne(resolutionService);

export default {
  createResolution,
  getResolution,
  getAllResolutions,
  deleteResolution,
  setPatientId,
};
