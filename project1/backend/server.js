const app = require('./app.js');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
