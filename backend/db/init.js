import config from 'config';

import sql from './sequelize.js';

export default () => {
  if (config.get('db.type') === 'sql') {
    sql.connect();
  }
  if (config.get('db.type') === 'redis') {
    // connections are happening in the respective services
  }
  if (config.get('db.type') === 'in-memory') {
    console.log('-----------------------------');
    console.log('In-memory database has been connected.');
  }
};
