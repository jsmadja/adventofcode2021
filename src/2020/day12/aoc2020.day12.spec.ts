import puzzle1Input from './puzzle1Input';

function executeInstructions(
  initialDirection: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST',
  initialPosition: { north: number; south: number; east: number; west: number },
  instructions: string[]
) {
  if (instructions.length === 0) {
    return initialPosition;
  }
  const [nextInstruction, ...rest] = instructions;
  const command = nextInstruction[0];
  const value = +nextInstruction.slice(1);
  const position = initialPosition;
  const direction = initialDirection;

  switch (command) {
    case 'N':
      position.north += value;
      break;
    case 'S':
      position.south += value;
      break;
    case 'E':
      position.east += value;
      break;
    case 'W':
      position.west += value;
      break;
    case 'F':
      if (direction === 'NORTH') {
        return executeInstructions(direction, position, [`N${value}`, ...rest]);
      }
      if (direction === 'SOUTH') {
        return executeInstructions(direction, position, [`S${value}`, ...rest]);
      }
      if (direction === 'EAST') {
        return executeInstructions(direction, position, [`E${value}`, ...rest]);
      }
      if (direction === 'WEST') {
        return executeInstructions(direction, position, [`W${value}`, ...rest]);
      }
      break;
    case 'R':
      if (value > 0) {
        const instruction = `${command}${value - 90}`;
        switch (direction) {
          case 'NORTH':
            return executeInstructions('EAST', position, [
              instruction,
              ...rest
            ]);
          case 'SOUTH':
            return executeInstructions('WEST', position, [
              instruction,
              ...rest
            ]);
          case 'WEST':
            return executeInstructions('NORTH', position, [
              instruction,
              ...rest
            ]);
          case 'EAST':
            return executeInstructions('SOUTH', position, [
              instruction,
              ...rest
            ]);
        }
      }
      break;
    case 'L':
      if (value > 0) {
        const instruction = `${command}${value - 90}`;
        switch (direction) {
          case 'NORTH':
            return executeInstructions('WEST', position, [
              instruction,
              ...rest
            ]);
          case 'SOUTH':
            return executeInstructions('EAST', position, [
              instruction,
              ...rest
            ]);
          case 'WEST':
            return executeInstructions('SOUTH', position, [
              instruction,
              ...rest
            ]);
          case 'EAST':
            return executeInstructions('NORTH', position, [
              instruction,
              ...rest
            ]);
        }
      }
      break;
    default:
      break;
  }
  return executeInstructions(direction, position, rest);
}

function toManathan(position: {
  north: number;
  west: number;
  east: number;
  south: number;
}) {
  return {
    ew: position.east - position.west,
    ns: position.south - position.north
  };
}

describe('Day 12', () => {
  describe('Part 1', () => {
    test('should pass example', () => {
      const instructions = `F10
N3
F7
R90
F11`;

      const initialPosition = {
        east: 0,
        north: 0,
        south: 0,
        west: 0
      };
      const position = executeInstructions(
        'EAST',
        initialPosition,
        instructions.split('\n')
      );
      expect(position).toStrictEqual({
        north: 3,
        west: 0,
        east: 17,
        south: 11
      });

      expect(toManathan(position)).toStrictEqual({ ew: 17, ns: 8 });
      expect(toManathan(position).ew + toManathan(position).ns).toBe(25);
    });
    test('should pass puzzle', () => {
      const instructions = puzzle1Input;

      const initialPosition = {
        east: 0,
        north: 0,
        south: 0,
        west: 0
      };
      const position = executeInstructions(
        'EAST',
        initialPosition,
        instructions.split('\n')
      );
      const manathan = toManathan(position);
      expect(Math.abs(manathan.ew + manathan.ns)).toBe(1133);
    });
  });
});
