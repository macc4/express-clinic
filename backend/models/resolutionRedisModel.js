import {
  getUnixExpiryFromBody,
  convertNameToBabelCase,
  capitalizeNameFromBabelCase,
  capitalizeNameFromRegularCase,
} from '../utils/bodyDecorator.js';
import { redisClient } from '../server.js';

export class ResolutionRedisModel {
  getKey(name) {
    return 'resolutions:' + convertNameToBabelCase(name);
  }

  async create(body) {
    let { name, resolution } = body;

    const keyName = this.getKey(name);
    const currentDate = new Date();
    const expiry = getUnixExpiryFromBody(body);

    const newResolutionEntry = {
      key: 'unique key',
      resolution: resolution,
      date: currentDate.getTime(),
    };

    // check for duplicate data
    const exists = await redisClient.exists(keyName);

    let resolutionsData;

    // if exists, then simply add a new resolution
    if (exists) {
      resolutionsData = JSON.parse(await redisClient.get(keyName));
      resolutionsData.resolutions.push(newResolutionEntry);

      await redisClient.set(keyName, JSON.stringify(resolutionsData));
    } else {
      resolutionsData = { resolutions: [newResolutionEntry] };

      await redisClient.set(keyName, JSON.stringify(resolutionsData));
    }

    if (expiry !== -1) {
      await redisClient.pexpireat(keyName, expiry);
    }

    const returnedPatient = {
      key: convertNameToBabelCase(name),
      name: capitalizeNameFromRegularCase(name),
      resolutions: resolutionsData.resolutions,
      expiry: expiry,
    };

    return returnedPatient;
  }

  async get(name) {
    const searchName = this.getKey(name);
    const resolutionsData = JSON.parse(await redisClient.get(searchName));

    if (!resolutionsData) {
      return undefined;
    }

    // PTTL is redis's function, shows TTL in ms, returns -1 if none
    const PTTL = await redisClient.pttl(searchName);

    // EXPIRE IS NOT WORKING

    let expiry;
    if (PTTL === -1) {
      expiry = PTTL;
    } else {
      const currentDate = new Date();
      expiry = currentDate.getTime() + PTTL;
    }

    const returnedPatient = {
      key: convertNameToBabelCase(name),
      name: capitalizeNameFromBabelCase(searchName.replace('resolutions:', '')),
      resolutions: resolutionsData.resolutions,
      expiry: expiry,
    };

    return returnedPatient;
  }

  async delete(key) {
    const searchKey = this.getKey(key);
    const resolutionsData = JSON.parse(await redisClient.get(searchKey));

    if (!resolutionsData) {
      return undefined;
    }

    const PTTL = await redisClient.pttl(searchKey);

    let expiry;
    if (PTTL === -1) {
      expiry = PTTL;
    } else {
      const currentDate = new Date();
      expiry = currentDate.getTime() + PTTL;
    }

    const returnedPatient = {
      key: key,
      name: capitalizeNameFromBabelCase(key),
      resolutions: resolutionsData.resolutions,
      expiry: expiry,
    };

    await redisClient.del(searchKey);

    return returnedPatient;
  }
}
