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
  constructor(queueType, otherTypes) {
    this.queueType = queueType;
    this.otherTypes = otherTypes;
    this.patientService = undefined;
    this.queueService = undefined;
    this.resolutionService = undefined;
    this.selectQueueType();
    this.selectOtherTypes();
  }

  selectQueueType() {
    switch (this.queueType) {
      case 'sql':
        this.queueService = new QueueSQLService();
        break;
      case 'redis':
        this.queueService = new QueueRedisService();
        break;
      case 'in-memory':
        this.queueService = new QueueInMemoryService();
        break;
    }
  }

  selectOtherTypes() {
    switch (this.otherTypes) {
      case 'sql':
        this.patientService = new PatientSQLService();
        this.resolutionService = new ResolutionSQLService();
        break;
      case 'redis':
        this.patientService = new PatientRedisService();
        this.resolutionService = new ResolutionRedisService();
        break;
      case 'in-memory':
        this.patientService = new PatientInMemoryService();
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

const clinicFactory = new ClinicFactory(
  config.get('db-type.queue'),
  config.get('db-type.patients/resolutions')
);
export default clinicFactory;

export { ClinicFactory }; // for tests
