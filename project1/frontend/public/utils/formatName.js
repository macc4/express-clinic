export function capitalizeFromBabelCase(str) {
  return str
    .split('-')
    .map(function capitalize(part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
}

export function capitalizeFromRegularCase(str) {
  return str
    .split(' ')
    .map(function capitalize(part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
}

export function convertToBabelCase(str) {
  str.toLowerCase();
  return str.split(' ').join('-');
}

export default {
  capitalizeFromBabelCase,
  capitalizeFromRegularCase,
  convertToBabelCase,
};
