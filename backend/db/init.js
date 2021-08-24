import config from 'config';

import sql from './sequelize.js';

export default () => {
  if (
    config.get('db-type.queue') === 'sql' ||
    config.get('db-type.patient/resolution' === 'sql')
  ) {
    sql.connect();
  }
  if (
    config.get('db-type.queue') === 'redis' ||
    config.get('db-type.patient/resolution' === 'redis')
  ) {
    // connections are happening in the respective services
  }
  if (
    config.get('db-type.queue') === 'in-memory' ||
    config.get('db-type.patient/resolution' === 'in-memory')
  ) {
    console.log('-----------------------------');
    console.log('In-memory database has been connected.');
  }
};
