import config from 'config';

import app from './app.js';
import initStorage from './db/init.js';

const port = config.get('server.port');

app.listen(port, () => {
  console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
  console.log(`Listening on port ${port}...`);
  console.log(`-----------------------------`);

  initStorage();
});
