import db from '../../db/memory.js';
import { AppError } from '../../utils/errorClasses.js';

let { patients, resolutions } = db;
let increment = 0;

export default class ResolutionInMemoryService {
  async createResolution(body, params) {
    // check if the patient exists first
    const patient = patients.find((patient) => patient.id === +params.patientId);

    if (!patient) {
      throw new AppError('No patient found with that ID', 404);
    }

    const currentDate = new Date();
    increment++;

    const newResolution = {
      id: increment,
      patientId: +params.patientId,
      resolution: body.resolution,
      updatedAt: currentDate.getTime(),
      createdAt: currentDate.getTime(),
    };

    resolutions.push(newResolution);

    return newResolution;
  }

  // not used in our project
  async getResolutionById(resolutionId) {
    const resolution = resolutions.find((resolution) => resolution.id === +resolutionId);

    return resolution;
  }

  async getAllResolutionsForThePatient(patientId) {
    const searchedResolutions = resolutions.filter(
      (resolution) => resolution.patientId === +patientId
    );

    return searchedResolutions;
  }

  async deleteAllResolutionsForThePatient(patientId) {
    const searchedResolutions = this.getAllResolutionsForThePatient(+patientId);

    resolutions = resolutions.filter((resolution) => resolution.patientId !== +patientId);

    return searchedResolutions;
  }
}
