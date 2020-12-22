import each from 'jest-each';
import _ from 'lodash';
import puzzle1Input from './puzzle1Input';

function computeNextDepart(busID: number, startDate: number) {
  return Math.ceil(startDate / busID) * busID;
}

describe('Day 13', () => {
  describe('Part 1', () => {
    each([
      [7, 945],
      [59, 944],
      [13, 949]
    ]).it(
      'should compute the next depart after a given date for bus',
      (busID, expectedNextDepart) => {
        const startDate = 939;
        const nextDepart = computeNextDepart(busID, startDate);
        expect(nextDepart).toBe(expectedNextDepart);
      }
    );

    it('should find the first bus to go', () => {
      const busIDs = [7, 13, 59, 31, 19];

      const startDate = 939;
      const bus = _(busIDs)
        .map((busID) => ({
          busID,
          nextDepart: computeNextDepart(busID, startDate)
        }))
        .minBy((b) => b.nextDepart);

      expect((bus.nextDepart - startDate) * bus.busID).toBe(295);
    });

    it('should pass puzzle', () => {
      const [startDate, buses] = puzzle1Input.split('\n');

      const busIDs = buses
        .split(',')
        .filter((x) => x !== 'x')
        .map((x) => +x);

      const bus = _(busIDs)
        .map((busID) => ({
          busID,
          nextDepart: computeNextDepart(busID, +startDate)
        }))
        .minBy((b) => b.nextDepart);

      expect((bus.nextDepart - +startDate) * bus.busID).toBe(171);
    });
  });
});
