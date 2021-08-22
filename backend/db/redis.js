import { promisify } from 'util';
import Redis from 'redis';
import config from 'config';

const db = {};

class RedisClient {
  constructor() {
    this.host = process.env.REDIS_HOST || 'localhost';
    this.port = config.get('db.redis.port') || '6379';

    this.connected = false;
    this.client = null;
  }

  connect() {
    if (this.connected) {
      return this.client;
    } else {
      this.client = Redis.createClient({
        host: this.host,
        port: this.port,
      });

      this.promisifyMethods();
      this.flushData();
      this.addScanMethod();

      this.connected = true;

      this.client.on('error', function (error) {
        throw new AppError(error, StatusCodes.INTERNAL_SERVER_ERROR);
      });

      this.client.on('connect', () => {
        console.log(`-----------------------------`);
        console.log(`Redis database has been connected.`);
      });

      return this.client;
    }
  }

  promisifyMethods() {
    this.client.exists = promisify(this.client.exists).bind(this.client);
    this.client.set = promisify(this.client.set).bind(this.client);
    this.client.get = promisify(this.client.get).bind(this.client);
    this.client.pexpireat = promisify(this.client.pexpireat).bind(this.client);
    this.client.pttl = promisify(this.client.pttl).bind(this.client);
    this.client.del = promisify(this.client.del).bind(this.client);
    this.client.lpush = promisify(this.client.lpush).bind(this.client);
    this.client.rpush = promisify(this.client.rpush).bind(this.client);
    this.client.lindex = promisify(this.client.lindex).bind(this.client);
    this.client.lpop = promisify(this.client.lpop).bind(this.client);
    this.client.lrange = promisify(this.client.lrange).bind(this.client);
    this.client.scan = promisify(this.client.scan).bind(this.client);
  }

  flushData() {
    this.client.flushall();
  }

  // add a custom scan method for redis
  addScanMethod() {
    this.client.scanAll = async (pattern) => {
      const found = [];
      let cursor = '0';

      do {
        const reply = await this.client.scan(cursor, 'MATCH', pattern);

        cursor = reply[0];
        found.push(...reply[1]);
      } while (cursor !== '0');

      return found;
    };
  }
}

db.RedisClient = new RedisClient();

export default db;
