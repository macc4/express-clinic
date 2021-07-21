const mainFunction = (start) => {
  let number = start;
  let i = 2;

  return () => {
    if (number % 5 === 0 && number !== 0) {
      i = 3;
      return (number /= 5);
    } else if (number % 7 === 0 && number !== 0) {
      i = 1;
      return (number -= 7);
    } else {
      return (number += i);
    }
  };
};

const enclosedFunc = mainFunction(0);

for (let i = 0; i < 10; i++) {
  let number = enclosedFunc();
  console.log(number);
}
