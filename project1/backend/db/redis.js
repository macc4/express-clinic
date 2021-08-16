import Redis from 'redis';
import config from 'config';
import AppError from '../utils/appError.js';
import { StatusCodes } from 'http-status-codes';
import { promisify } from 'util';

export const redisClient = Redis.createClient({
  host: config.get('db.redis.host'),
  port: config.get('db.redis.port'),
});

redisClient.on('error', function (err) {
  throw new AppError(err, StatusCodes.INTERNAL_SERVER_ERROR);
});

redisClient.on('connect', () => {
  console.log('💃 connected redis successfully 💃');
});

redisClient.flushall();

const existsAsync = promisify(redisClient.exists).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const pexpireatAsync = promisify(redisClient.pexpireat).bind(redisClient);
const pttlAsync = promisify(redisClient.pttl).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);
const lpushAsync = promisify(redisClient.lpush).bind(redisClient);
const rpushAsync = promisify(redisClient.rpush).bind(redisClient);
const lindexAsync = promisify(redisClient.lindex).bind(redisClient);
const lpopAsync = promisify(redisClient.lpop).bind(redisClient);
const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);

export {
  existsAsync,
  setAsync,
  getAsync,
  pexpireatAsync,
  pttlAsync,
  delAsync,
  lpushAsync,
  rpushAsync,
  lindexAsync,
  lpopAsync,
  lrangeAsync,
};
