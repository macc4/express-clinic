const capitalizeNameFromBabelCase = str =>
  str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const capitalizeNameFromRegularCase = str =>
  str
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

const convertNameToBabelCase = str => {
  str = str.toLowerCase();
  return str.split(' ').join('-');
};

export {
  capitalizeNameFromBabelCase,
  capitalizeNameFromRegularCase,
  convertNameToBabelCase,
};
