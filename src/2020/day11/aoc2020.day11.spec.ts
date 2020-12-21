import _ from 'lodash';
import puzzle1Input from './puzzle1Input';

type Seats = string[][];

enum SeatState {
  OCCUPIED = '#',
  FREE = 'L'
}

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
    return this.getOccupiedAdjacentSeatCount(rowIndex, columnIndex) >= 4;
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

  private getOccupiedAdjacentSeatCount(rowIndex: number, columnIndex: number) {
    let occupied = 0;
    const previousRow = Ferry.previousRow(rowIndex);
    const nextRow = this.nextRow(rowIndex);
    const previousColumn = Ferry.previousColumn(columnIndex);
    const nextColumn = this.nextColumn(columnIndex);
    for (let row = previousRow; row <= nextRow; row++) {
      for (let column = previousColumn; column <= nextColumn; column++) {
        if (!(row === rowIndex && column === columnIndex)) {
          occupied += this.seats[row][column] === SeatState.OCCUPIED ? 1 : 0;
        }
      }
    }
    return occupied;
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
    it('should free a seat that have 4 adjacent occupied seats', () => {
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
      expect(ferry.getSeatsAsText()).toBe(`#.LL.L#.##
#LLLLLL.L#
L.L.L..L..
#LLL.LL.L#
#.LL.LL.LL
#.LLLL#.##
..L.L.....
#LLLLLLLL#
#.LLLLLL.L
#.#LLLL.##`);

      ferry.placePeople();
      expect(ferry.getSeatsAsText()).toBe(`#.##.L#.##
#L###LL.L#
L.#.#..#..
#L##.##.L#
#.##.LL.LL
#.###L#.##
..#.#.....
#L######L#
#.LL###L.L
#.#L###.##`);

      ferry.placePeople();
      expect(ferry.getSeatsAsText()).toBe(`#.#L.L#.##
#LLL#LL.L#
L.L.L..#..
#LLL.##.L#
#.LL.LL.LL
#.LL#L#.##
..L.L.....
#L#LLLL#L#
#.LLLLLL.L
#.#L#L#.##`);

      ferry.placePeople();
      expect(ferry.getSeatsAsText()).toBe(`#.#L.L#.##
#LLL#LL.L#
L.#.L..#..
#L##.##.L#
#.#L.LL.LL
#.#L#L#.##
..L.L.....
#L#L##L#L#
#.LLLLLL.L
#.#L#L#.##`);

      ferry.placePeople();
      expect(ferry.getSeatsAsText()).toBe(`#.#L.L#.##
#LLL#LL.L#
L.#.L..#..
#L##.##.L#
#.#L.LL.LL
#.#L#L#.##
..L.L.....
#L#L##L#L#
#.LLLLLL.L
#.#L#L#.##`);
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
      expect(ferry.getSeatsAsText()).toBe(`#.#L.L#.##
#LLL#LL.L#
L.#.L..#..
#L##.##.L#
#.#L.LL.LL
#.#L#L#.##
..L.L.....
#L#L##L#L#
#.LLLLLL.L
#.#L#L#.##`);
      expect(ferry.getOccupiedSeatCount()).toBe(37);
    });
    it('should get puzzle 1 input answer', () => {
      const seats = toSeats(puzzle1Input);
      const ferry = new Ferry(seats);
      ferry.placePeopleStable();
      expect(ferry.getOccupiedSeatCount()).toBe(2113);
    });
  });
  describe('Part 2', () => {});
});
