import config from 'config';

const getUnixExpiryFromTTL = (body) => {
  const currentTime = new Date();

  if (body.timeToLive) {
    return currentTime.getTime() + body.timeToLive * 60 * 1000;
  } else if (config.get('app.timeToLive') === -1) {
    return -1;
  } else {
    return currentTime.getTime() + config.get('app.timeToLive') * 60 * 1000;
  }
};

const capitalizeNameFromBabelCase = (str) => {
  return str
    .split('-')
    .map(function capitalize(part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
};

const capitalizeNameFromRegularCase = (str) => {
  return str
    .split(' ')
    .map(function capitalize(part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
};

const convertNameToBabelCase = (str) => {
  str = str.toLowerCase();
  return str.split(' ').join('-');
};

export default {
  capitalizeNameFromBabelCase,
  capitalizeNameFromRegularCase,
  convertNameToBabelCase,
  getUnixExpiryFromTTL,
};
