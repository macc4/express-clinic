const getUnixExpiry = (expiry, defaultExpiry) => {
  if (expiry && expiry >= 1) {
    return Date.now() + expiry * 60 * 1000;
  }

  if (defaultExpiry === -1) {
    return -1;
  }

  return Date.now() + defaultExpiry * 60 * 1000;
};

const checkIfExpired = expiry => {
  if (expiry === -1) return false;
  if (Date.now() > expiry) return true;

  return false;
};

export default { checkIfExpired, getUnixExpiry };
