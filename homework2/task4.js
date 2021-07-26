// implementation is using 2 different algorithms, one for magic squares
// with odd order, and one for doubly even order (4, 8, 12)
// it does not create singly even magic squares (6, 10, 14)

// functions take the order of the square and print out the square in the console

const genMagicSquareOdd = function (order) {
  let magicSquare = Array(order)
    .fill(0)
    .map(() => Array(order).fill(0));

  // square coordinates
  let i = Math.floor(order / 2);
  let j = order - 1;

  // num - numbers that we put in the square
  for (let num = 1; num <= order * order; ) {
    if (i == -1 && j == order) {
      j = order - 2;
      i = 0;
    } else {
      if (j == order) j = 0;
      if (i < 0) i = order - 1;
    }

    if (magicSquare[i][j] != 0) {
      j -= 2;
      i++;
      continue;
    } else magicSquare[i][j] = num++;

    j++;
    i--;
  }

  console.log('The Magic Square for ' + order + ':\n');
  console.log(magicSquare.join('\n'));
};

const genMagicSquareDoublyEven = function (order) {
  let magicSquare = Array(order)
    .fill(0)
    .map(() => Array(order).fill(0));
  let i, j;

  // used for changing the value at the corners of the square
  const quarterOfOrder = Math.floor(order / 4);

  for (i = 0; i < order; i++)
    for (j = 0; j < order; j++) magicSquare[i][j] = order * i + j + 1;

  for (i = 0; i < quarterOfOrder; i++)
    for (j = 0; j < quarterOfOrder; j++)
      magicSquare[i][j] = order * order + 1 - magicSquare[i][j];

  for (i = 0; i < quarterOfOrder; i++)
    for (j = 3 * quarterOfOrder; j < order; j++)
      magicSquare[i][j] = order * order + 1 - magicSquare[i][j];

  for (i = 3 * quarterOfOrder; i < order; i++)
    for (j = 0; j < quarterOfOrder; j++)
      magicSquare[i][j] = order * order + 1 - magicSquare[i][j];

  for (i = 3 * quarterOfOrder; i < order; i++)
    for (j = 3 * quarterOfOrder; j < order; j++)
      magicSquare[i][j] = order * order + 1 - magicSquare[i][j];

  for (i = quarterOfOrder; i < 3 * quarterOfOrder; i++)
    for (j = quarterOfOrder; j < 3 * quarterOfOrder; j++)
      magicSquare[i][j] = order * order + 1 - magicSquare[i][j];

  console.log('The Magic Square for ' + order + ':\n');
  console.log(magicSquare.join('\n'));
};

const genMagicSquareSinglyEven = function (order) {
  console.log(
    'This implementation works only with odd and doubly even numbers. ;-;'
  );
};

let order = 4;

if (order !== 0 && order !== 2 && order % 4 == 2) {
  genMagicSquareSinglyEven(order);
} else if (order !== 0 && order % 4 == 0) {
  genMagicSquareDoublyEven(order);
} else if (order == 2) {
  console.log('Magic square with the order of 2 cannot be generated.');
} else {
  genMagicSquareOdd(order);
}
