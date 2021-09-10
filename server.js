import config from 'config';

import app from './app.js';
import db from './src/db/clients/sequelize.client.js';

const port = config.get('server.port');

app.listen(port, () => {
  console.log(`NODE_ENV: ${config.util.getEnv('NODE_ENV')}`); // eslint-disable-line no-console
  console.log(`Listening on port ${port}...`); // eslint-disable-line no-console
  console.log(`-----------------------------`); // eslint-disable-line no-console

  db.connect();
});
