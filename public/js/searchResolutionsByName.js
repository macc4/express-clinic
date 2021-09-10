/* eslint-disable */

const searchResolutionsByName = name => {
  window.location.href = window.location.pathname + '?name=' + name;
};

export default searchResolutionsByName;
