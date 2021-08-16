import app from './app.js';
import config from 'config';

const port = config.get('server.port');
const host = config.get('server.host');

app.listen(port, host, () => {
  console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
  console.log(`Listening on port ${port}...`);
});
