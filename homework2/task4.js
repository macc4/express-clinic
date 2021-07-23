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

  for (i = 0; i < n; i++)
    for (j = 0; j < n; j++) magicSquare[i][j] = n * i + j + 1;

  for (i = 0; i < Math.floor(n / 4); i++)
    for (j = 0; j < Math.floor(n / 4); j++)
      magicSquare[i][j] = n * n + 1 - magicSquare[i][j];

  for (i = 0; i < Math.floor(n / 4); i++)
    for (j = 3 * Math.floor(n / 4); j < n; j++)
      magicSquare[i][j] = n * n + 1 - magicSquare[i][j];

  for (i = 3 * Math.floor(n / 4); i < n; i++)
    for (j = 0; j < Math.floor(n / 4); j++)
      magicSquare[i][j] = n * n + 1 - magicSquare[i][j];

  for (i = 3 * Math.floor(n / 4); i < n; i++)
    for (j = 3 * Math.floor(n / 4); j < n; j++)
      magicSquare[i][j] = n * n + 1 - magicSquare[i][j];

  for (i = Math.floor(n / 4); i < 3 * Math.floor(n / 4); i++)
    for (j = Math.floor(n / 4); j < 3 * Math.floor(n / 4); j++)
      magicSquare[i][j] = n * n + 1 - magicSquare[i][j];

  console.log('The Magic Square for ' + n + ':\n');
  console.log(magicSquare.join('\n'));
};

const genMagicSquareSinglyEven = function (n) {
  console.log(
    'This implementation works only with odd and doubly-even numbers. ;-;'
  );
};

n = 20;

if (n !== 0 && n !== 2 && n % 4 == 2) {
  genMagicSquareSinglyEven(n);
} else if (n !== 0 && n % 4 == 0) {
  genMagicSquareDoublyEven(n);
} else if (n == 2) {
  console.log('Magic square with the order of 2 cannot be generated.');
} else {
  genMagicSquareOdd(n);
}
