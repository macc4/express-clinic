const capitalizeNameFromBabelCase = str => {
  return str
    .split('-')
    .map(function capitalize(part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
};

const capitalizeNameFromRegularCase = str => {
  return str
    .split(' ')
    .map(function capitalize(part) {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(' ');
};

const convertNameToBabelCase = str => {
  str = str.toLowerCase();
  return str.split(' ').join('-');
};

export {
  capitalizeNameFromBabelCase,
  capitalizeNameFromRegularCase,
  convertNameToBabelCase,
};
