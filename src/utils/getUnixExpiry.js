import config from 'config';

const getUnixExpiry = expiry => {
  const currentTime = new Date();

  if (expiry && expiry >= 1) {
    return currentTime.getTime() + expiry * 60 * 1000;
  }

  if (config.get('app.timeToLive') === -1) {
    return -1;
  }

  return currentTime.getTime() + config.get('app.timeToLive') * 60 * 1000;
};

export default getUnixExpiry;
