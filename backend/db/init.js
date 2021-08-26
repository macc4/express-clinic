import config from 'config';

import sql from './sequelize.js';
import redisClient from './redis.js';

export default () => {
  if (
    config.get('db.type.queue') === 'in-memory' ||
    config.get('db.type.main') === 'in-memory'
  ) {
    console.log('In-memory database has been connected.');
    console.log(`-----------------------------`);
  }
  if (
    config.get('db.type.queue') === 'redis' ||
    config.get('db.type.main') === 'redis'
  ) {
    const redis = redisClient.client;
    redis.on('connect', () => {
      console.log(`Redis database has been connected.`);
      console.log(`-----------------------------`);
    });
  }
  if (
    config.get('db.type.queue') === 'sql' ||
    config.get('db.type.main') === 'sql'
  ) {
    sql.connect();
  }
};
