import _ from 'lodash';
import puzzle1Input from './puzzle1Input';

function findPair(
  expectedSum: number,
  preambule: number[]
): number[] | undefined {
  return _(preambule)
    .map((first, index) =>
      preambule.slice(index + 1).map((second) => [first, second])
    )
    .flatten()
    .find((pair) => pair[0] + pair[1] === expectedSum);
}

function findInvalidNumber(preambule: number[], numbers: number[]) {
  const number = numbers[0];
  const pair = findPair(number, preambule);
  if (pair) {
    const newPreambule = preambule.slice(1);
    newPreambule.push(number);
    return findInvalidNumber(newPreambule, numbers.slice(1));
  }
  return number;
}

function findContiguousSet(sumToFind: number, fullSet: number[]) {
  let sum = 0;
  let contiguous = [];
  let offset = 0;
  let size = 2;
  while (sum !== sumToFind) {
    contiguous = fullSet.slice(offset, offset + size);
    sum = contiguous.reduce((a, b) => a + b, 0);
    if (sum > sumToFind) {
      offset += 1;
      size = 2;
    }
    if (size < sumToFind) {
      size++;
    }
  }
  return contiguous;
}

describe('Day 9', () => {
  describe('Part 1', () => {
    test('should find a valid pair which sum is equal to next number 1+2 = 3', () => {
      const preambule = [1, 2];
      const pair = findPair(3, preambule);
      expect(pair).toStrictEqual([1, 2]);
    });
    test('should find a valid pair which sum is equal to next number 2+3 = 5', () => {
      const preambule = [2, 3];
      const pair = findPair(5, preambule);
      expect(pair).toStrictEqual([2, 3]);
    });
    test('should not find a valid pair which sum is equal to next number 6', () => {
      const preambule = [2, 3];
      const pair = findPair(6, preambule);
      expect(pair).toBeUndefined();
    });
    test('should find the not sumable number 2', () => {
      const preambule = `2
3`
        .split('\n')
        .map((n) => +n);

      const numbers = `5
6`
        .split('\n')
        .map((n) => +n);

      const invalidNumber = findInvalidNumber(preambule, numbers);

      expect(invalidNumber).toBe(6);
    });
    test('should find the not sumable number in simple example', () => {
      const preambuleLength = 5;
      const str = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`;
      const preambule = str
        .split('\n')
        .slice(0, preambuleLength)
        .map((n) => +n);

      const numbers = str
        .split('\n')
        .slice(preambuleLength)
        .map((n) => +n);

      const invalidNumber = findInvalidNumber(preambule, numbers);

      expect(invalidNumber).toBe(127);
    });
    test('should find the not sumable number in puzzle', () => {
      const preambuleLength = 25;
      const preambule = puzzle1Input
        .split('\n')
        .slice(0, preambuleLength)
        .map((n) => +n);

      const numbers = puzzle1Input
        .split('\n')
        .slice(preambuleLength)
        .map((n) => +n);

      const invalidNumber = findInvalidNumber(preambule, numbers);

      expect(invalidNumber).toBe(15353384);
    });
  });
  describe('Part 2', () => {
    test('should find a contiguous set with example', () => {
      const numbers = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`
        .split('\n')
        .map((x) => +x);

      const set = findContiguousSet(127, numbers);
      expect(set).toStrictEqual([15, 25, 47, 40]);

      const min = Math.min(...set);
      const max = Math.max(...set);
      expect(min + max).toBe(62);
    });
    test('should find a contiguous set with puzzle input', () => {
      const numbers = puzzle1Input.split('\n').map((x) => +x);
      const set = findContiguousSet(15353384, numbers);
      const min = Math.min(...set);
      const max = Math.max(...set);
      expect(min + max).toBe(2466556);
    });
  });
});
