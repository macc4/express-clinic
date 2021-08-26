import redisClient, { redisScan } from '../../db/redis.js';
import { AppError } from '../../utils/errorClasses.js';

export default class ResolutionRedisService {
  constructor() {
    this.redis = redisClient.connect();
    this.increment = 0;
  }
  async createResolution(body, params) {
    this.increment++;
    // check if the patient exists first

    const patients = await redisScan(
      this.redis,
      `patients:{\"id\":${+params.patientId},\"name\"*`
    );

    if (patients.length === 0) {
      throw new AppError('No patient found with that ID', 404);
    }

    const resolutionKey =
      'resolutions:' +
      JSON.stringify({ id: this.increment, patientId: +params.patientId });

    const currentDate = new Date();

    const resolutionValue = {
      resolution: body.resolution,
      updatedAt: currentDate.getTime(),
      createdAt: currentDate.getTime(),
    };

    await this.redis.set(resolutionKey, JSON.stringify(resolutionValue));

    return {
      id: this.increment,
      patientId: +params.patientId,
      ...resolutionValue,
    };
  }

  // not used in our project
  async getResolutionById(resolutionId) {
    const resolutionsKey = await redisScan(
      this.redis,
      `resolutions:{\"id\":${resolutionId},\"patientId\"*`
    );

    if (resolutionsKey.length === 0) {
      return undefined;
    }

    const data = JSON.parse(resolutionsKey[0].replace('resolutions:', ''));
    const resolution = JSON.parse(await this.redis.get(resolutionsKey));

    return { ...data, ...resolution };
  }

  async getAllResolutionsForThePatient(patientId) {
    const resolutionKeys = await redisScan(
      this.redis,
      `resolutions:{\"id\":*,\"patientId\":${patientId}}`
    );

    let outputData = [];

    for (const key of resolutionKeys) {
      const data = JSON.parse(await this.redis.get(key));
      const patientAndResolutionId = JSON.parse(
        key.replace('resolutions:', '')
      );
      const resolutionObject = { ...patientAndResolutionId, ...data };
      outputData.push(resolutionObject);
    }

    return outputData;
  }

  async deleteAllResolutionsForThePatient(patientId) {
    const resolutionKeys = await redisScan(
      this.redis,
      `resolutions:{\"id\":*,\"patientId\":${patientId}}`
    );

    let outputData = [];

    for (const key of resolutionKeys) {
      const data = JSON.parse(await this.redis.get(key));
      const patientAndResolutionId = JSON.parse(
        key.replace('resolutions:', '')
      );
      const resolutionObject = { ...patientAndResolutionId, ...data };
      outputData.push(resolutionObject);
      await this.redis.del(key);
    }

    return outputData;
  }
}
