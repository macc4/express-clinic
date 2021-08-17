const getExpiryDate = (timeToLive) => {
  const currentTime = new Date();

  return currentTime.getTime() + timeToLive * 60 * 1000;
};

export { getExpiryDate };
