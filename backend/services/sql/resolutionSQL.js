import getUnixExpiryFromBody from '../../utils/getUnixExpiry.js';

export default class ResolutionSQLService {
  constructor(database) {
    this.db = database;
    this.Resolution = this.db.resolutions;
    // this.Sequelize = db.Sequelize; may be required in the future for querying
  }

  async createResolution(body, params) {
    const expiry = getUnixExpiryFromBody(body);

    const newResolution = await this.Resolution.create({
      patientId: +params.patientId,
      resolution: body.resolution,
      expiry: expiry,
    });

    return newResolution;
  }

  async getAllResolutionsForThePatient(patientId) {
    const data = await this.Resolution.findAll({
      where: { patientId: patientId },
      // include: 'patient',  // THIS IS OPTIONAL
    });

    const currentDate = new Date();
    data.forEach(async resolution => {
      if (
        currentDate.getTime() > resolution.dataValues.expiry &&
        resolution.dataValues.expiry !== -1
      ) {
        await this.deleteResolutionById(resolution.dataValues.id);
      }
    });

    const resolutions = data.filter(
      resolution =>
        currentDate.getTime() < resolution.dataValues.expiry ||
        resolution.dataValues.expiry === -1
    );

    return resolutions;
  }

  async deleteAllResolutionsForThePatient(patientId) {
    const resolutions = await this.Resolution.destroy({
      where: { patientId: patientId },
    });

    return resolutions;
  }

  // not used in the project
  async getResolutionById(resolutionId) {
    const resolution = await this.Resolution.findOne({
      where: { id: resolutionId },
    });

    const currentDate = new Date();

    if (resolution) {
      if (
        currentDate.getTime() > resolution.dataValues.expiry &&
        resolution.dataValues.expiry !== -1
      ) {
        await this.deleteResolutionById(resolution.dataValues.id);
        return undefined;
      }
    }

    return resolution;
  }

  // not used in the frontend, but used for TTL deletion
  async deleteResolutionById(resolutionId) {
    const resolutions = await this.Resolution.destroy({
      where: { id: resolutionId },
    });

    return resolutions;
  }
}
