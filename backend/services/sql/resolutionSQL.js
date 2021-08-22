import db from '../../db/sequelize.js';

export default class ResolutionSQLService {
  constructor() {
    this.db = db;
    this.Resolution = db.resolutions;
    // this.Sequelize = db.Sequelize; may be required in the future for querying
  }

  async createResolution(body, params) {
    const newResolution = await this.Resolution.create({
      patientId: +params.patientId,
      ...body,
    });

    return newResolution;
  }

  // not used in the project
  async getResolutionById(resolutionId) {
    const resolution = await this.Resolution.findOne({
      where: { id: resolutionId },
    });

    return resolution;
  }

  async getAllResolutionsForThePatient(patientId) {
    const resolutions = await this.Resolution.findAll({
      where: { patientId: patientId },
      // include: 'patient',  // THIS IS OPTIONAL
    });

    return resolutions;
  }

  async deleteAllResolutionsForThePatient(patientId) {
    const resolutions = await this.Resolution.destroy({
      where: { patientId: patientId },
    });

    return resolutions;
  }
}
