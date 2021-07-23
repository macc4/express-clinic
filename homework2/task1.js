const bulbs = function (bulbs, inversions) {
  let count = 0;

  // create an array to represent the state of the lightbulb and fill it with ones
  const bulbsArray = new Array(bulbs);
  bulbsArray.fill(1, 0);

  // change the state of lightbulbs for each input
  inversions.forEach((el) => {
    for (let i = 1; i <= bulbsArray.length; i++) {
      if (i % el === 0) {
        bulbsArray[i - 1] += 1;
      }
    }
  });

  // check the state of every light bulb (if even - it is on, if odd - it is off)
  bulbsArray.forEach((el) => {
    if (el % 2 == 0) {
      count += 1;
    }
  });

  return count;
};

console.log(bulbs(20, [2, 3, 8]));
console.log(bulbs(172, [19, 2, 7, 13, 40, 23, 16, 1, 45, 9]));
