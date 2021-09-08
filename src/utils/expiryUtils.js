const getUnixExpiry = (expiry, defaultExpiry) => {
  const currentTime = new Date();

  if (expiry && expiry >= 1) {
    return currentTime.getTime() + expiry * 60 * 1000;
  }

  if (defaultExpiry === -1) {
    return -1;
  }

  return currentTime.getTime() + defaultExpiry * 60 * 1000;
};

const checkIfExpired = expiry => {
  const currentDate = new Date();

  if (expiry === -1) return false;
  if (currentDate.getTime() > expiry) return true;

  return false;
};

export default { checkIfExpired, getUnixExpiry };
