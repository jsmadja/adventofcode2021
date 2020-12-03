import input from './input';
import puzzle1Input from './puzzle1Input';

enum CellType {
  TREE,
  OPEN_SQUARE
}

interface Slope {
  right: number;
  down: number;
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

function getEncounteredTreeCount(template: string, slope: Slope) {
  return template
    .split('\n')
    .slice(1)
    .map((line, index) => {
      if (index % slope.down === 0) {
        return getCellTypeInLineAtPosition(line, (index + 1) * slope.right);
      }
      return CellType.OPEN_SQUARE;
    })
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
      expect(getEncounteredTreeCount(input, { right: 3, down: 1 })).toBe(7);
    });

    test('Compute puzzle 1 input', () => {
      expect(getEncounteredTreeCount(puzzle1Input, { right: 3, down: 1 })).toBe(
        187
      );
    });
  });
  describe('Part 2', () => {
    test('Compute puzzle 2 input', () => {
      function getPuzzle2Answer(slopes: Slope[]): number {
        return slopes
          .map((slope) => getEncounteredTreeCount(puzzle1Input, slope))
          .reduce((prev, current) => prev * current, 1);
      }

      const slopes = [
        { right: 1, down: 1 },
        { right: 3, down: 1 },
        { right: 5, down: 1 },
        { right: 7, down: 1 },
        { right: 1, down: 2 }
      ];
      expect(getPuzzle2Answer(slopes)).toBe(4723283400);
    });
  });
});
