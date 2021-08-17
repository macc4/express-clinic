import Redis from 'redis';
import config from 'config';
import AppError from '../utils/appError.js';
import { StatusCodes } from 'http-status-codes';
import { promisify } from 'util';

const redisClient = Redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: config.get('db.redis.port'),
});

redisClient.on('error', function (err) {
  throw new AppError(err, StatusCodes.INTERNAL_SERVER_ERROR);
});

redisClient.on('connect', () => {
  console.log(`Redis connected redis successfully`);
});

redisClient.flushall();

redisClient.exists = promisify(redisClient.exists).bind(redisClient);
redisClient.set = promisify(redisClient.set).bind(redisClient);
redisClient.get = promisify(redisClient.get).bind(redisClient);
redisClient.pexpireat = promisify(redisClient.pexpireat).bind(redisClient);
redisClient.pttl = promisify(redisClient.pttl).bind(redisClient);
redisClient.del = promisify(redisClient.del).bind(redisClient);
redisClient.lpush = promisify(redisClient.lpush).bind(redisClient);
redisClient.rpush = promisify(redisClient.rpush).bind(redisClient);
redisClient.lindex = promisify(redisClient.lindex).bind(redisClient);
redisClient.lpop = promisify(redisClient.lpop).bind(redisClient);
redisClient.lrange = promisify(redisClient.lrange).bind(redisClient);

export { redisClient };
