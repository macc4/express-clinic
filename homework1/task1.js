let carSettings = {
  ABS: 5,
  traction: 5,
  stability: 5,
};

console.log(carSettings);

// function that updates the settings object
const setSettings = (value, obj) =>
  Object.keys(obj).forEach((el) => (obj[el] = value));

// main solution, 3 functions that change the difficulty
const beginner = function () {
  setSettings(5, carSettings);
};

const goodDriver = function () {
  setSettings(3, carSettings);
};

const maniac = function () {
  setSettings(1, carSettings);
};

goodDriver();
console.log(carSettings);

// optional solution, one function that controls the difficulty
const chooseDifficulty = function (option) {
  const difficulty = option.toLowerCase().trim();
  switch (difficulty) {
    case 'beginner':
      setSettings(5, carSettings);
      break;
    case 'good driver':
      setSettings(3, carSettings);
      break;
    case 'maniac':
      setSettings(1, carSettings);
      break;
    default:
      console.log(`Sorry, we don't have the ${option} difficulty.`);
  }
};

chooseDifficulty('maniac');
console.log(carSettings);
