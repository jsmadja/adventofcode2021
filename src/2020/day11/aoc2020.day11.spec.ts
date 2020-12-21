import _ from 'lodash';
import puzzle1Input from './puzzle1Input';

type Seats = string[][];

enum SeatState {
  OCCUPIED = '#',
  FREE = 'L'
}

const directions = {
  NORTH: [0, -1],
  NE: [1, -1],
  EAST: [1, 0],
  SE: [1, 1],
  SOUTH: [0, 1],
  SW: [-1, 1],
  WEST: [-1, 0],
  NW: [-1, -1]
};

class Ferry {
  // eslint-disable-next-line no-useless-constructor
  constructor(private seats: Seats = []) {
    //
  }

  private static previousColumn(columnIndex: number) {
    return columnIndex === 0 ? columnIndex : columnIndex - 1;
  }

  private static previousRow(rowIndex: number) {
    return rowIndex === 0 ? rowIndex : rowIndex - 1;
  }

  getOccupiedSeatCount() {
    return _(this.seats)
      .flatMap()
      .filter((seat) => seat === SeatState.OCCUPIED)
      .value().length;
  }

  placePeople() {
    const newSeats = _.cloneDeep(this.seats);

    this.seats.forEach((row, rowIndex) => {
      row.forEach((seat, columnIndex) => {
        newSeats[rowIndex][columnIndex] = this.seats[rowIndex][columnIndex];
        if (seat === SeatState.FREE && this.isPleasant(rowIndex, columnIndex)) {
          newSeats[rowIndex][columnIndex] = SeatState.OCCUPIED;
        }
        if (
          seat === SeatState.OCCUPIED &&
          this.isBoring(rowIndex, columnIndex)
        ) {
          newSeats[rowIndex][columnIndex] = SeatState.FREE;
        }
      });
    });
    this.seats = newSeats;
  }

  public isBoring(rowIndex: number, columnIndex: number) {
    return this.getOccupiedAdjacentSeatCount(rowIndex, columnIndex) >= 5;
  }

  getSeatsAsText() {
    return this.seats.map((row) => row.join('')).join('\n');
  }

  placePeopleStable() {
    let previousState = [];
    while (
      this.getSeatsAsText() !== new Ferry(previousState).getSeatsAsText()
    ) {
      previousState = _.cloneDeep(this.seats);
      this.placePeople();
    }
  }

  public isOccupiedInDirection(direction, rowIndex, columnIndex) {
    const nextRowIndex = rowIndex + direction[1];
    const nextColumnIndex = columnIndex + direction[0];
    if (this.isInvalidSeatLocation(nextRowIndex, nextColumnIndex)) {
      return false;
    }
    const cell = this.seats[nextRowIndex][nextColumnIndex];
    if (cell === SeatState.OCCUPIED) {
      return true;
    }
    if (cell === SeatState.FREE) {
      return false;
    }
    return this.isOccupiedInDirection(direction, nextRowIndex, nextColumnIndex);
  }

  private isInvalidSeatLocation(nextRowIndex, nextColumnIndex) {
    return (
      nextRowIndex >= this.seats.length ||
      nextColumnIndex >= this.seats[0].length ||
      nextRowIndex < 0 ||
      nextColumnIndex < 0
    );
  }

  private getOccupiedAdjacentSeatCount(rowIndex: number, columnIndex: number) {
    return _.values(directions).filter((direction) =>
      this.isOccupiedInDirection(direction, rowIndex, columnIndex)
    ).length;
  }

  private isPleasant(rowIndex: number, columnIndex: number) {
    return this.getOccupiedAdjacentSeatCount(rowIndex, columnIndex) === 0;
  }

  private nextColumn(columnIndex: number) {
    return columnIndex === this.seats[0].length - 1
      ? columnIndex
      : columnIndex + 1;
  }

  private nextRow(rowIndex: number) {
    return rowIndex === this.seats.length - 1 ? rowIndex : rowIndex + 1;
  }
}

function toSeats(l: string) {
  return l.split('\n').map((row) => row.split(''));
}

describe('Day 11', () => {
  describe('Part 1', () => {
    it('should create an empty ferry', () => {
      const ferry = new Ferry();
      expect(ferry.getOccupiedSeatCount()).toBe(0);
    });
    it('should create a ferry with one occupied seat', () => {
      const seats = [[SeatState.OCCUPIED]];
      const ferry = new Ferry(seats);
      expect(ferry.getOccupiedSeatCount()).toBe(1);
    });
    it('should occupy all seats after one round', () => {
      const seats = ['L.LL.LL.LL'.split('')];
      const ferry = new Ferry(seats);
      ferry.placePeople();
      expect(ferry.getOccupiedSeatCount()).toBe(7);
      expect(ferry.getSeatsAsText()).toBe('#.##.##.##');
    });
    it('should free a seat that have 5 adjacent occupied seats', () => {
      const l = `####
####
####`;

      const seats = l.split('\n').map((row) => row.split(''));
      const ferry = new Ferry(seats);
      ferry.placePeople();
      expect(ferry.getOccupiedSeatCount()).toBe(4);
      expect(ferry.getSeatsAsText()).toBe(`#LL#
LLLL
#LL#`);
    });
    it('should pass example', () => {
      const seats = toSeats(`L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`);
      const ferry = new Ferry(seats);
      ferry.placePeople();
      expect(ferry.getSeatsAsText()).toBe(`#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##`);

      ferry.placePeople();
      expect(ferry.getSeatsAsText()).toBe(`#.LL.LL.L#
#LLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLL#
#.LLLLLL.L
#.LLLLL.L#`);

      ferry.placePeople();
      expect(ferry.getSeatsAsText()).toBe(`#.L#.##.L#
#L#####.LL
L.#.#..#..
##L#.##.##
#.##.#L.##
#.#####.#L
..#.#.....
LLL####LL#
#.L#####.L
#.L####.L#`);

      ferry.placePeople();
      expect(ferry.getSeatsAsText()).toBe(`#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##LL.LL.L#
L.LL.LL.L#
#.LLLLL.LL
..L.L.....
LLLLLLLLL#
#.LLLLL#.L
#.L#LL#.L#`);

      ferry.placePeople();
      expect(ferry.getSeatsAsText()).toBe(`#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##L#.#L.L#
L.L#.#L.L#
#.L####.LL
..#.#.....
LLL###LLL#
#.LLLLL#.L
#.L#LL#.L#`);

      ferry.placePeople();
      expect(ferry.getSeatsAsText()).toBe(`#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##L#.#L.L#
L.L#.LL.L#
#.LLLL#.LL
..#.L.....
LLL###LLL#
#.LLLLL#.L
#.L#LL#.L#`);
    });
    it('should get puzzle 1 example answer', () => {
      const seats = toSeats(`L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`);
      const ferry = new Ferry(seats);
      ferry.placePeopleStable();
      expect(ferry.getSeatsAsText()).toBe(`#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##L#.#L.L#
L.L#.LL.L#
#.LLLL#.LL
..#.L.....
LLL###LLL#
#.LLLLL#.L
#.L#LL#.L#`);
      expect(ferry.getOccupiedSeatCount()).toBe(26);
    });
    it('should get puzzle 1 input answer', () => {
      const seats = toSeats(puzzle1Input);
      const ferry = new Ferry(seats);
      ferry.placePeopleStable();
      expect(ferry.getOccupiedSeatCount()).toBe(1865);
    });
    it('should tell if there is a person in view at (1,0)', () => {
      const seats = toSeats(`.............
.L.L.#.#.#.#.
.............`);
      const ferry = new Ferry(seats);
      expect(ferry.isOccupiedInDirection(directions.EAST, 1, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.NORTH, 1, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.SOUTH, 1, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.WEST, 1, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.NE, 1, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.SE, 1, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.SW, 1, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.NW, 1, 0)).toBe(false);
    });
    it('should tell if there is a person in view at (0,0)', () => {
      const seats = toSeats(`.............
.#.L.#.#.#.#.
.............`);
      const ferry = new Ferry(seats);
      expect(ferry.isOccupiedInDirection(directions.EAST, 0, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.NORTH, 0, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.SOUTH, 0, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.WEST, 0, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.NE, 0, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.SE, 0, 0)).toBe(true);
      expect(ferry.isOccupiedInDirection(directions.SW, 0, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.NW, 0, 0)).toBe(false);
    });
    it('should tell if there is a person in view at (0,0) long distance', () => {
      const seats = toSeats(`.............
...L.#.#.#.#.
..#..........`);
      const ferry = new Ferry(seats);
      expect(ferry.isOccupiedInDirection(directions.EAST, 0, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.NORTH, 0, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.SOUTH, 0, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.WEST, 0, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.NE, 0, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.SE, 0, 0)).toBe(true);
      expect(ferry.isOccupiedInDirection(directions.SW, 0, 0)).toBe(false);
      expect(ferry.isOccupiedInDirection(directions.NW, 0, 0)).toBe(false);
    });

    it('should pass simple example round 3', () => {
      const seats = toSeats(`#.LL.LL.L#
#LLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLL#
#.LLLLLL.L
#.LLLLL.L#`);

      const ferry = new Ferry(seats);
      ferry.placePeople();
      expect(ferry.getSeatsAsText()).toBe(`#.L#.##.L#
#L#####.LL
L.#.#..#..
##L#.##.##
#.##.#L.##
#.#####.#L
..#.#.....
LLL####LL#
#.L#####.L
#.L####.L#`);
    });
  });
});
