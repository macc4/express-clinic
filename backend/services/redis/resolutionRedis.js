import config from 'config';
import db from '../../db/redis.js';
import { capitalizeNameFromRegularCase } from '../../utils/bodyDecorator.js';
import { ModelConflictError } from '../../utils/errorClasses.js';

let increment = 0;

// NOT YET DONE

if (config.get('db.type') === 'redis') {
  db.client = db.RedisClient.connect();
}

export default class ResolutionRedisService {
  async createResolution(body, params) {
    const newResolution = await this.Resolution.create({
      patientId: +params.patientId,
      ...body,
    });

    return newResolution;
  }

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
