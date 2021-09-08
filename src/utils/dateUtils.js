const getUnixFromDays = days =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const getUnixOneMin = () => new Date(Date.now() + 60 * 1000);

export default { getUnixFromDays, getUnixOneMin };
