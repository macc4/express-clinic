import config from 'config';
import { ResolutionInMemoryModel } from './resolutionInMemoryModel.js';
import { ResolutionRedisModel } from './resolutionRedisModel.js';

class ResolutionFactory {
  constructor(type) {
    this.type = type;
  }

  create() {
    switch (this.type) {
      case 'in-memory':
        return new ResolutionInMemoryModel();
      case 'redis':
        return new ResolutionRedisModel();
    }
  }
}

const resolutionFactory = new ResolutionFactory(config.get('db.type'));
const resolutionModel = resolutionFactory.create();

export default resolutionModel;
export { ResolutionFactory };
