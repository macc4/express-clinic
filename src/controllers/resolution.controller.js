import factory from './handler.factory.js';
import resolutionService from '../services/resolution.service.js';

// middleware for nested "patient/:patientId/resolution" routes
const setPatientID = (req, res, next) => {
  // for create function
  if (Object.keys(req.body).length && !req.body.patientId) {
    req.body.patientId = +req.params.patientId;
  }

  // for getAll function (so we won't populate req.query with unnecessary data when posting)
  if (!Object.keys(req.body).length && req.params.patientId) {
    req.query.patientId = +req.params.patientId;
  }

  next();
};

const createResolution = factory.createOne(resolutionService);
const getResolutionByID = factory.getByID(resolutionService);
const getAllResolutions = factory.getAll(resolutionService);
const deleteResolutionByID = factory.deleteByID(resolutionService);

export default {
  createResolution,
  getResolutionByID,
  getAllResolutions,
  deleteResolutionByID,
  setPatientID,
};
