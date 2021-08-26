import config from 'config';
import { QueueInMemoryModel } from './queueInMemoryModel.js';
import { QueueRedisModel } from './queueRedisModel.js';

class QueueFactory {
  constructor(type) {
    this.type = type;
  }

  create() {
    switch (this.type) {
      case 'in-memory':
        return new QueueInMemoryModel();
      case 'redis':
        return new QueueRedisModel();
    }
  }
}

const queueFactory = new QueueFactory(config.get('db.type'));
const queueModel = queueFactory.create();

export default queueModel;
export { QueueFactory };
