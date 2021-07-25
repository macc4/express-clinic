// implementation was created based on simple binary search
// it iterates through the array of [0, ..., maximum time requried to make all of the copies)
// and checks if average value is enough to make (copies - 1) (not including the first copy),
// if no - use the left half of the array
// if yes - use the right half, until we get to the optimal result

const copy = function (copies, firstCopierSpeed, secondCopierSpeed) {
  if (copies == 1) {
    return Math.min(firstCopierSpeed, secondCopierSpeed);
  }

  let answer = 0;
  let lower = 0;
  let upper = Math.max(firstCopierSpeed, secondCopierSpeed) * copies;

  while (lower <= upper) {
    let mid = Math.floor((lower + upper) / 2);
    if (mid / firstCopierSpeed + mid / secondCopierSpeed >= copies - 1) {
      answer = mid;
      upper = mid - 1;
    } else {
      lower = mid + 1;
    }
  }

  return answer + Math.min(firstCopierSpeed, secondCopierSpeed);
};

console.log(copy(50, 1, 2)); // 34
console.log(copy(4, 1, 1)); // 3
console.log(copy(5, 1, 2)); // 4
