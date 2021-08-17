import app from './app.js';
import config from 'config';

const port = config.get('server.port');

app.listen(port, () => {
  console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
  console.log(`Listening on port ${port}...`);
});
