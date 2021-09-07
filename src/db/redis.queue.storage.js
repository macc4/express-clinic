import redisClient from './clients/redis.client.js';

class RedisStorage {
  constructor(client) {
    this.client = client.connect();
  }

  async getQueue() {
    return await this.client.lrange('queue', 0, -1);
  }

  async enqueue(id) {
    return await this.client.rpush('queue', id);
  }

  async peek() {
    return await this.client.lindex('queue', 0);
  }

  async dequeue() {
    return await this.client.lpop('queue');
  }
}

const redisStorage = new RedisStorage(redisClient);

export default redisStorage;
