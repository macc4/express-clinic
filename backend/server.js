import app from './app.js';
import config from 'config';
import { RedisClient } from './db/redis.js';

const port = config.get('server.port');

// init redis

const redisClient = new RedisClient().connect();

app.listen(port, () => {
  console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
  console.log(`Listening on port ${port}...`);
});

export { redisClient };
