// implemantaion was created based on "binary search the answer"
// https://oldaddr.wordpress.com/2014/06/28/binary-search-the-answer/
// acmp.ru #523

const generateVolumes = function (pages, volumes) {
  let lower = Math.max(...pages) - 1;
  let upper = pages.reduce((a, b) => a + b);

  while (lower + 1 < upper) {
    let mid = Math.floor((lower + upper) / 2);
    let answer = 0;
    let lastChapterPages = 0;

    for (let i = 0; i < pages.length; i++) {
      if (lastChapterPages + pages[i] <= mid) {
        lastChapterPages += pages[i];
      } else {
        answer++;
        lastChapterPages = pages[i];
      }
    }

    answer++;
    if (answer <= volumes) {
      upper = mid;
    } else {
      lower = mid;
    }
  }
  return upper;
};

console.log(generateVolumes([1, 2, 1], 2)); // 3
console.log(generateVolumes([1, 2, 1, 1], 3)); // 2
console.log(generateVolumes([2, 4, 3, 5, 4, 1, 5], 3)); // 9
