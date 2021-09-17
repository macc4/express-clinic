import redisClient from './clients/redis.client.js';

export class RedisQueueStorage {
  constructor(client) {
    this.client = client.connect();
  }

  async getQueue(doctorId) {
    return await this.client.lrange(`queue:${doctorId}`, 0, -1);
  }

  async enqueue(id, doctorId) {
    return await this.client.rpush(`queue:${doctorId}`, id);
  }

  async peek(doctorId) {
    return await this.client.lindex(`queue:${doctorId}`, 0);
  }

  async dequeue(doctorId) {
    return await this.client.lpop(`queue:${doctorId}`);
  }
}

const redisQueueStorage = new RedisQueueStorage(redisClient);

export default redisQueueStorage;
