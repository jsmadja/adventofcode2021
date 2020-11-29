import each from 'jest-each';
import input from './2019/day1/input';

type Mass = number;
type Fuel = number;

function calculateRequiredFuel(mass: Mass): Fuel {
  return Math.max(Math.floor(mass / 3) - 2, 0);
}

function calculateTrueRequiredFuel(mass: Mass): Fuel {
  if (mass > 0) {
    const requiredFuel = calculateRequiredFuel(mass);
    return requiredFuel + calculateTrueRequiredFuel(requiredFuel);
  }
  return 0;
}

describe('Day 1', () => {
  describe('Part 1', () => {
    const testData = [
      [12, 2],
      [14, 2],
      [1969, 654],
      [100756, 33583],
    ];

    each(testData).test(
      'For a mass of %d, the fuel required is %d',
      (mass, requiredFuel) => {
        expect(calculateRequiredFuel(mass)).toBe(requiredFuel);
      },
    );

    test('should compute full required fuel', () => {
      expect(
        input
          .split('\n')
          .map((mass) => calculateRequiredFuel(+mass))
          .reduce((accumulator, requiredFuel) => accumulator + requiredFuel, 0),
      ).toBe(3479429);
    });
  });

  describe('Part 2', () => {
    const testData = [
      [14, 2],
      [1969, 966],
      [100756, 50346],
    ];

    each(testData).test(
      'For a mass of %d, the true required fuel is %d',
      (mass, requiredFuel) => {
        expect(calculateTrueRequiredFuel(mass)).toBe(requiredFuel);
      },
    );

    test('should compute true full required fuel', () => {
      expect(
        input
          .split('\n')
          .map((mass) => calculateTrueRequiredFuel(+mass))
          .reduce((accumulator, requiredFuel) => accumulator + requiredFuel, 0),
      ).toBe(5216273);
    });
  });
});
