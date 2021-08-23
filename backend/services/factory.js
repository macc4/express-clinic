import config from 'config';

import PatientInMemoryService from './inMemory/patientInMemory.js';
import QueueInMemoryService from './inMemory/queueInMemory.js';
import ResolutionInMemoryService from './inMemory/resolutionInMemory.js';

import PatientRedisService from './redis/patientRedis.js';
import QueueRedisService from './redis/queueRedis.js';
import ResolutionRedisService from './redis/resolutionRedis.js';

import PatientSQLService from './sql/patientSQL.js';
import QueueSQLService from './sql/queueSQL.js';
import ResolutionSQLService from './sql/resolutionSQL.js';

class ClinicFactory {
  constructor(type) {
    this.type = type;
    this.patientService = undefined;
    this.queueService = undefined;
    this.resolutionService = undefined;
    this.selectType();
  }

  selectType() {
    switch (this.type) {
      case 'sql':
        this.patientService = new PatientSQLService();
        this.queueService = new QueueSQLService();
        this.resolutionService = new ResolutionSQLService();
        break;
      case 'redis':
        this.patientService = new PatientRedisService();
        this.queueService = new QueueRedisService();
        this.resolutionService = new ResolutionRedisService();
        break;
      case 'in-memory':
        this.patientService = new PatientInMemoryService();
        this.queueService = new QueueInMemoryService();
        this.resolutionService = new ResolutionInMemoryService();
        break;
    }
  }

  get getPatientService() {
    return this.patientService;
  }

  get getQueueService() {
    return this.queueService;
  }

  get getResolutionService() {
    return this.resolutionService;
  }
}

const clinicFactory = new ClinicFactory(config.get('db.type'));
export default clinicFactory;

export { ClinicFactory }; // for tests
