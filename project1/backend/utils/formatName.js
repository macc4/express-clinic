module.exports = (str) => {
  return str
    .split('-')
    .map(function capitalize(part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
};
