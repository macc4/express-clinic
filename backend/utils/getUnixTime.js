import config from 'config';

export default getUnixExpiryFromBody = (body) => {
  const currentTime = new Date();

  if (body.hasOwnProperty('timeToLive')) {
    return currentTime.getTime() + body.timeToLive * 60 * 1000;
  } else if (config.get('app.timeToLive') === -1) {
    return -1;
  } else {
    return currentTime.getTime() + config.get('app.timeToLive') * 60 * 1000;
  }
};
