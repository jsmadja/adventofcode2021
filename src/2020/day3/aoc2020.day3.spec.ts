import input from './input';
import puzzle1Input from './puzzle1Input';

enum CellType {
  TREE,
  OPEN_SQUARE
}

function getCellTypeOf(cell: string): CellType {
  return cell === '#' ? CellType.TREE : CellType.OPEN_SQUARE;
}

function getCellTypeInLineAtPosition(line: string, position: number): CellType {
  if (position >= line.length) {
    return getCellTypeInLineAtPosition(line + line, position);
  }
  return getCellTypeOf(line.split('')[position]);
}

function getEncounteredTreeCount(template: string) {
  return template
    .split('\n')
    .slice(1)
    .map((line, index) => getCellTypeInLineAtPosition(line, (index + 1) * 3))
    .filter((type) => type === CellType.TREE).length;
}

describe('Day 3', () => {
  describe('Part 1', () => {
    test('a cell # should be recognized as a Tree', () => {
      const cell = '#';

      const cellType = getCellTypeOf(cell);

      expect(cellType).toBe(CellType.TREE);
    });
    test('a cell . should be recognized as an Open Square', () => {
      const cell = '.';

      const cellType = getCellTypeOf(cell);

      expect(cellType).toBe(CellType.OPEN_SQUARE);
    });
    test('A # in the third position in a line should be recognized as a Tree', () => {
      const line = '..##.......';

      const cellType = getCellTypeInLineAtPosition(line, 3);

      expect(cellType).toBe(CellType.TREE);
    });
    test('A # in the third position in a line should be recognized as a Tree', () => {
      const line = '...#.......';

      const cellType = getCellTypeInLineAtPosition(line, 14);

      expect(cellType).toBe(CellType.TREE);
    });
    test('Compute puzzle 1 example', () => {
      expect(getEncounteredTreeCount(input)).toBe(7);
    });

    test('Compute puzzle 1 input', () => {
      expect(getEncounteredTreeCount(puzzle1Input)).toBe(187);
    });
  });
});
