// leetcode #881

const findKayakAmount = function (people, weight) {
  people.sort((a, b) => a - b);
  let lower = 0;
  let upper = people.length - 1;
  let answer = people.length;

  while (lower < upper) {
    if (people[upper] + people[lower] <= weight) {
      answer--;
      lower++;
      upper--;
    } else {
      upper--;
    }
  }
  return answer;
};
console.log(findKayakAmount([50, 74, 60, 82], 135)); // 2
console.log(findKayakAmount([50, 120, 74, 60, 100, 82], 135)); // 4
