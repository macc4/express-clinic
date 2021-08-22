import config from 'config';

import sql from './sequelize.js';
import redis from './redis.js';

export default () => {
  if (config.get('db.type') === 'sql') {
    sql.connect();
  }
  if (config.get('db.type') === 'redis') {
    redis.client = redis.RedisClient.connect();
  }
  if (config.get('db.type') === 'in-memory') {
    console.log('-----------------------------');
    console.log('In-memory database has been connected.');
  }
};

export { redis };
