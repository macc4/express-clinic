import app from './app.js';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
