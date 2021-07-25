// implementation is using 2 different algorithms, one for magic squares
// with odd order, and one for doubly even order (4, 8, 12)
// it does not create singly even magic squares (6, 10, 14)

// n - order of the square

// both functions print out the square in the console

const genMagicSquareOdd = function (n) {
  let magicSquare = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  let i = Math.floor(n / 2);
  let j = n - 1;

  for (let num = 1; num <= n * n; ) {
    if (i == -1 && j == n) {
      j = n - 2;
      i = 0;
    } else {
      if (j == n) j = 0;
      if (i < 0) i = n - 1;
    }

    if (magicSquare[i][j] != 0) {
      j -= 2;
      i++;
      continue;
    } else magicSquare[i][j] = num++;

    j++;
    i--;
  }

  console.log('The Magic Square for ' + n + ':\n');
  console.log(magicSquare.join('\n'));
};

const genMagicSquareDoublyEven = function (n) {
  let magicSquare = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));
  let i, j;

  // used for changing the value at the corners of the square
  const k = Math.floor(n / 4);

  for (i = 0; i < n; i++)
    for (j = 0; j < n; j++) magicSquare[i][j] = n * i + j + 1;

  for (i = 0; i < k; i++)
    for (j = 0; j < k; j++) magicSquare[i][j] = n * n + 1 - magicSquare[i][j];

  for (i = 0; i < k; i++)
    for (j = 3 * k; j < n; j++)
      magicSquare[i][j] = n * n + 1 - magicSquare[i][j];

  for (i = 3 * k; i < n; i++)
    for (j = 0; j < k; j++) magicSquare[i][j] = n * n + 1 - magicSquare[i][j];

  for (i = 3 * k; i < n; i++)
    for (j = 3 * k; j < n; j++)
      magicSquare[i][j] = n * n + 1 - magicSquare[i][j];

  for (i = k; i < 3 * k; i++)
    for (j = k; j < 3 * k; j++)
      magicSquare[i][j] = n * n + 1 - magicSquare[i][j];

  console.log('The Magic Square for ' + n + ':\n');
  console.log(magicSquare.join('\n'));
};

const genMagicSquareSinglyEven = function (n) {
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
