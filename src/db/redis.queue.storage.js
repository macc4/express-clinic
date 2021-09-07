import redisClient from './clients/redis.client.js';

class RedisStorage {
  constructor(client) {
    this.client = client.connect();
  }

  async getQueue() {
    await this.client.lrange('queue', 0, -1);
  }

  async enqueue(id) {
    await this.client.rpush('queue', id);
  }

  async peek() {
    await this.client.lindex('queue', 0);
  }

  async dequeue() {
    await this.client.lpop('queue');
  }
}

const redisStorage = new RedisStorage(redisClient);

export default redisStorage;
