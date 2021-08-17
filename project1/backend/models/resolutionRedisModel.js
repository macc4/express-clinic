import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError.js';
import errorMessages from '../lib/errorMessages.js';
import {
  getUnixExpiryFromBody,
  convertNameToBabelCase,
  capitalizeNameFromBabelCase,
  capitalizeNameFromRegularCase,
} from '../utils/bodyDecorator.js';
import { redisClient } from '../db/redis.js';

export class ResolutionRedisModel {
  async create(body) {
    let { name, resolution } = body;

    const keyName = convertNameToBabelCase(name);
    const currentDate = new Date();
    const expiry = getUnixExpiryFromBody(body);

    // check for duplicate data
    const duplicatePatient = await redisClient.exists('resolutions:' + keyName);

    if (duplicatePatient) {
      throw new AppError(errorMessages.CONFLICT, StatusCodes.CONFLICT);
    }

    const newResolution = {
      key: 'unique key',
      resolution: resolution,
      date: currentDate.getTime(),
    };

    await redisClient.set('resolutions:' + keyName, JSON.stringify(newResolution));

    if (expiry !== -1) {
      await redisClient.pexpireat('resolutions:' + keyName, expiry);
    }

    const returnedPatient = {
      key: convertNameToBabelCase(name),
      name: capitalizeNameFromRegularCase(name),
      resolutions: newResolution,
      expiry: expiry,
    };

    return returnedPatient;
  }

  async get(name) {
    const searchName = 'resolutions:' + convertNameToBabelCase(name);
    const resolutions = JSON.parse(await redisClient.get(searchName));

    if (!resolutions) {
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
      resolutions: resolutions,
      expiry: expiry,
    };

    return returnedPatient;
  }

  async delete(key) {
    const searchKey = 'resolutions:' + key;
    const resolutions = JSON.parse(await redisClient.get(searchKey));

    if (!resolutions) {
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
      resolutions: resolutions,
      expiry: expiry,
    };

    await redisClient.del(searchKey);

    return returnedPatient;
  }
}
