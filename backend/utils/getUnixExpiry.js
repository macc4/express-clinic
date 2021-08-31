import config from 'config';

const getUnixExpiryFromBody = body => {
  const currentTime = new Date();

  if (Object.prototype.hasOwnProperty.call(body, 'timeToLive')) {
    return currentTime.getTime() + body.timeToLive * 60 * 1000;
  }

  if (config.get('app.timeToLive') === -1) {
    return -1;
  }

  return currentTime.getTime() + config.get('app.timeToLive') * 60 * 1000;
};

export default getUnixExpiryFromBody;
