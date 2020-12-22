import puzzle1Input from './puzzle1Input';

type Position = {
  north: number;
  south: number;
  east: number;
  west: number;
};

function executeInstructions(
  initialDirection: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST',
  shipInitialPosition: Position,
  waypointInitialPosition: Position,
  instructions: string[]
) {
  if (instructions.length === 0) {
    return [shipInitialPosition, waypointInitialPosition];
  }
  const [nextInstruction, ...rest] = instructions;
  const command = nextInstruction[0];
  const value = +nextInstruction.slice(1);
  const shipPosition = shipInitialPosition;
  const waypointPosition = waypointInitialPosition;
  const direction = initialDirection;

  switch (command) {
    case 'N':
      waypointPosition.north += value;
      break;
    case 'S':
      waypointPosition.south += value;
      break;
    case 'E':
      waypointPosition.east += value;
      break;
    case 'W':
      waypointPosition.west += value;
      break;
    case 'F':
      shipPosition.north += waypointPosition.north * value;
      shipPosition.east += waypointPosition.east * value;
      shipPosition.west += waypointPosition.west * value;
      shipPosition.south += waypointPosition.south * value;
      return executeInstructions(
        direction,
        shipPosition,
        waypointInitialPosition,
        rest
      );
    case 'R':
      if (value > 0) {
        const temp = waypointPosition.north;
        waypointPosition.north = waypointPosition.west;
        waypointPosition.west = waypointPosition.south;
        waypointPosition.south = waypointPosition.east;
        waypointPosition.east = temp;
        const instruction = `${command}${value - 90}`;
        // eslint-disable-next-line default-case
        switch (direction) {
          case 'NORTH':
            return executeInstructions('EAST', shipPosition, waypointPosition, [
              instruction,
              ...rest
            ]);
          case 'SOUTH':
            return executeInstructions('WEST', shipPosition, waypointPosition, [
              instruction,
              ...rest
            ]);
          case 'WEST':
            return executeInstructions(
              'NORTH',
              shipPosition,
              waypointPosition,
              [instruction, ...rest]
            );
          case 'EAST':
            return executeInstructions(
              'SOUTH',
              shipPosition,
              waypointPosition,
              [instruction, ...rest]
            );
        }
      }
      break;
    case 'L':
      if (value > 0) {
        const temp = waypointPosition.north;
        waypointPosition.north = waypointPosition.east;
        waypointPosition.east = waypointPosition.south;
        waypointPosition.south = waypointPosition.west;
        waypointPosition.west = temp;
        const instruction = `${command}${value - 90}`;
        // eslint-disable-next-line default-case
        switch (direction) {
          case 'NORTH':
            return executeInstructions('WEST', shipPosition, waypointPosition, [
              instruction,
              ...rest
            ]);
          case 'SOUTH':
            return executeInstructions('EAST', shipPosition, waypointPosition, [
              instruction,
              ...rest
            ]);
          case 'WEST':
            return executeInstructions(
              'SOUTH',
              shipPosition,
              waypointPosition,
              [instruction, ...rest]
            );
          case 'EAST':
            return executeInstructions(
              'NORTH',
              shipPosition,
              waypointPosition,
              [instruction, ...rest]
            );
        }
      }
      break;
    default:
      break;
  }
  return executeInstructions(direction, shipPosition, waypointPosition, rest);
}

function toManathan(position: Position) {
  return {
    ew: position.east - position.west,
    ns: position.south - position.north
  };
}

describe('Day 12', () => {
  describe('Part 2', () => {
    it('should pass example', () => {
      const shipPosition = {
        north: 0,
        east: 0,
        south: 0,
        west: 0
      };
      const waypointPoint = {
        north: 1,
        east: 10,
        west: 0,
        south: 0
      };
      const [newShipPosition, newWaypointPosition] = executeInstructions(
        'EAST',
        shipPosition,
        waypointPoint,
        ['F10', 'N3', 'F7', 'R90', 'F11']
      );
      expect(newShipPosition).toStrictEqual({
        east: 214,
        north: 38,
        west: 0,
        south: 110
      });
      expect(newWaypointPosition).toStrictEqual({
        east: 4,
        north: 0,
        west: 0,
        south: 10
      });

      const manathan = toManathan(newShipPosition);
      expect(manathan.ew).toBe(214);
      expect(manathan.ns).toBe(72);
      expect(manathan.ew + manathan.ns).toBe(286);
    });
    it('should pass puzzle', () => {
      const shipPosition = {
        north: 0,
        east: 0,
        south: 0,
        west: 0
      };
      const waypointPoint = {
        north: 1,
        east: 10,
        west: 0,
        south: 0
      };
      const [newShipPosition] = executeInstructions(
        'EAST',
        shipPosition,
        waypointPoint,
        puzzle1Input.split('\n')
      );
      const manathan = toManathan(newShipPosition);
      expect(Math.abs(manathan.ew) + Math.abs(manathan.ns)).toBe(61053);
    });
  });
});
