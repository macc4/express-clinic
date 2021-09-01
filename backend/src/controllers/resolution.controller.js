import factory from './handler.factory.js';
import resolutionService from '../services/resolution.service.js';

const createResolution = factory.createOne(resolutionService);
const getResolution = factory.getOne(resolutionService);
const getAllResolutions = factory.getAll(resolutionService);
const deleteResolution = factory.deleteOne(resolutionService);

export default {
  createResolution,
  getResolution,
  getAllResolutions,
  deleteResolution,
};
