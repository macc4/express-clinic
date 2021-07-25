const bulbs = function (bulbs, inversions) {
  // create an array to represent the state of the lightbulb and fill it with 2's
  const bulbsArray = new Array(bulbs);
  bulbsArray.fill(2, 0);

  // change the state of lightbulbs for each input
  inversions.forEach((el) => {
    for (let i = 1; i <= bulbsArray.length; i++) {
      if (i % el === 0) {
        bulbsArray[i - 1] += 1;
      }
    }
  });

  // check the state of every lightbulb (if odd - it is on, if even - it is off)
  let litLightbulbs = bulbsArray.reduce((accumulator, currentValue) => {
    return accumulator + (currentValue % 2);
  }, 0);

  return litLightbulbs;
};

console.log(bulbs(20, [2, 3, 8])); // 8
console.log(bulbs(172, [19, 2, 7, 13, 40, 23, 16, 1, 45, 9])); // 99
