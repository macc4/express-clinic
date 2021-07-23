const copy = function (n, x, y) {
  if (n == 1) {
    return Math.min(x, y);
  }

  let answer = 0;
  let lower = 0;
  let upper = Math.max(x, y) * n;

  while (lower <= upper) {
    let mid = Math.floor((lower + upper) / 2);
    if (mid / x + mid / y >= n - 1) {
      answer = mid;
      upper = mid - 1;
    } else {
      lower = mid + 1;
    }
  }

  return answer + Math.min(x, y);
};

console.log(copy(50, 1, 2)); // 34
console.log(copy(4, 1, 1)); // 3
console.log(copy(5, 1, 2)); // 4
