import input from './2020/day1/input';

function sumIsEqualTo2020(first, second) {
  return first + second === 2020;
}

function find2NumbersWhichSumTo2020From(data: number[]) {
  for (let firstIndex = 0; firstIndex < data.length; firstIndex++) {
    const sumable = data.find((item) =>
      sumIsEqualTo2020(data[firstIndex], item)
    );
    if (sumable) return [data[firstIndex], sumable];
  }
  throw new Error('2 Numbers which sum to 2020 not found');
}

function find3NumbersWhichSumTo2020From(data: number[]) {
  const count = data.length;
  for (let firstIndex = 0; firstIndex < count; firstIndex++) {
    for (let secondIndex = firstIndex + 1; secondIndex < count; secondIndex++) {
      for (let thirdIndex = secondIndex + 1; thirdIndex < count; thirdIndex++) {
        if (data[firstIndex] + data[secondIndex] + data[thirdIndex] === 2020) {
          return [data[firstIndex], data[secondIndex], data[thirdIndex]];
        }
      }
    }
  }
  throw new Error('3 Numbers which sum to 2020 not found');
}

describe('Day 1', () => {
  const data = [1721, 979, 366, 299, 675, 1456];

  describe('Part 1', () => {
    test('should find two numbers which sum to 2020', () => {
      expect(find2NumbersWhichSumTo2020From(data)).toStrictEqual([1721, 299]);
    });
    test('should resolve example puzzle input', () => {
      const [first, second] = find2NumbersWhichSumTo2020From(data);
      expect(first * second).toBe(514579);
    });
    test('should resolve puzzle input', () => {
      const [first, second] = find2NumbersWhichSumTo2020From(input);
      expect(first * second).toBe(1018944);
    });
  });
  describe('Part 2', () => {
    test('should find three numbers which sum to 2020', () => {
      expect(find3NumbersWhichSumTo2020From(data)).toStrictEqual([
        979,
        366,
        675
      ]);
    });
    test('should resolve example puzzle input', () => {
      const [first, second, third] = find3NumbersWhichSumTo2020From(data);
      expect(first * second * third).toBe(241861950);
    });
    test('should resolve puzzle input', () => {
      const [first, second, third] = find3NumbersWhichSumTo2020From(input);
      expect(first * second * third).toBe(8446464);
    });
  });
});
