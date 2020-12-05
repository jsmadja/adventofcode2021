import puzzle1Input from './puzzle1Input';

function divide(pattern: string, from: number, to: number) {
  const letter = pattern[0];
  const midLength = Math.floor((to - from) / 2);
  if (pattern.length === 1) {
    return letter === 'F' || letter === 'L' ? from : to;
  }
  const rest = pattern.substring(1);
  if (letter === 'F' || letter === 'L') {
    return divide(rest, from, from + midLength);
  }
  return divide(rest, from + midLength + 1, to);
}

function getSeatIDFrom(pattern: string) {
  const columnPattern = pattern.substring(0, 7);
  const rowPattern = pattern.substring(7);
  const row = divide(columnPattern, 0, 127);
  const column = divide(rowPattern, 0, 7);
  return row * 8 + column;
}

describe('Day 5', () => {
  describe('Part 1', () => {
    test('should pass acceptance tests', () => {
      expect(getSeatIDFrom('FBFBBFFRLR')).toBe(357);
      expect(getSeatIDFrom('BFFFBBFRRR')).toBe(567);
      expect(getSeatIDFrom('FFFBBBFRRR')).toBe(119);
      expect(getSeatIDFrom('BBFFBBFRLL')).toBe(820);
    });
    test('should get puzzle 1 answer', () => {
      const answer = puzzle1Input
        .split('\n')
        .map(getSeatIDFrom)
        .reduce(
          (previousValue, currentValue) =>
            Math.max(previousValue, currentValue),
          0
        );
      expect(answer).toBe(998);
    });
  });
  describe('Part 2', () => {
    const seats = puzzle1Input
      .split('\n')
      .map(getSeatIDFrom)
      .sort((a, b) => a - b);
    let index = 0;
    while (index < seats.length && seats[index] + 1 === seats[index + 1]) {
      index++;
    }
    expect(seats[index] + 1).toBe(676);
  });
});
