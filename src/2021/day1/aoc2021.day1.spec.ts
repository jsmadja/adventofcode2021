import input from './input';

const countGreaterThanPrevious = (
  previousValue,
  currentValue,
  currentIndex,
  array
) => {
  if (currentValue > array[currentIndex - 1]) {
    return previousValue + 1;
  }
  return previousValue;
};

function processPart1(data: number[]) {
  return data.reduce(countGreaterThanPrevious, 0);
}

function processPart2(data: number[]) {
  return data
    .map((current, index, array) => {
      if (index < array.length - 2) {
        return array[index] + array[index + 1] + array[index + 2];
      }
      return undefined;
    })
    .filter(Number)
    .reduce(countGreaterThanPrevious, 0);
}

describe('Day 1', () => {
  const data = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263];

  describe('Part 1', () => {
    test('should solve part1 example', () => {
      expect(processPart1(data)).toBe(7);
    });
    test('should solve part1', () => {
      expect(processPart1(input)).toBe(1316);
    });
  });
  describe('Part 2', () => {
    test('should part2 example', () => {
      expect(processPart2(data)).toBe(5);
    });
    test('should solve part2', () => {
      expect(processPart2(input)).toBe(1344);
    });
  });
});
