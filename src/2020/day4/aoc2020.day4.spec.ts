import input from './input';
import puzzle1Input from './puzzle1Input';

interface Passport {
  ecl?: string;
  pid?: string;
  eyr?: number;
  hcl?: string;
  byr?: number;
  iyr?: number;
  cid?: number;
  hgt?: string;
}

function createPassportFrom(passportAsString: string) {
  return passportAsString
    .split('\n')
    .join(' ')
    .split(' ')
    .reduce((prev, curr) => {
      const [key, value] = curr.split(':');
      const obj = { ...prev };
      obj[key] =
        key === 'ecl' || key === 'hcl' || key === 'hgt' || key === 'pid'
          ? value
          : +value;
      return obj;
    }, {} as any);
}

function isValid(passport: Passport) {
  return (
    !!passport.ecl &&
    !!passport.pid &&
    !!passport.eyr &&
    !!passport.hcl &&
    !!passport.byr &&
    !!passport.iyr &&
    !!passport.hgt
  );
}

describe('Day 4', () => {
  describe('Part 1', () => {
    test('it should create Passport from string input', () => {
      const passportAsString = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm`;

      const passport: Passport = createPassportFrom(passportAsString);

      expect(passport).toStrictEqual({
        ecl: 'gry',
        pid: '860033327',
        eyr: 2020,
        hcl: '#fffffd',
        byr: 1937,
        iyr: 2017,
        cid: 147,
        hgt: '183cm'
      });
    });
    test('it should create Passport with missing fields', () => {
      const passportAsString = `iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929`;
      const passport: Passport = createPassportFrom(passportAsString);

      expect(passport).toStrictEqual({
        pid: '028048884',
        eyr: 2023,
        ecl: 'amb',
        hcl: '#cfa07d',
        byr: 1929,
        iyr: 2013,
        cid: 350
      });
    });
    test('A valid passport can omit cid field', () => {
      const passport = {
        ecl: 'gry',
        pid: '860033327',
        eyr: 2020,
        hcl: '#fffffd',
        byr: 1937,
        iyr: 2017,
        hgt: '183cm'
      };
      const valid = isValid(passport);

      expect(valid).toBe(true);
    });
    test('A valid passport should have byr field', () => {
      const passport = {
        ecl: 'gry',
        pid: '860033327',
        eyr: 2020,
        hcl: '#fffffd',
        iyr: 2017,
        hgt: '183cm'
      };
      const valid = isValid(passport);
      expect(valid).toBe(false);
    });
    test('A valid passport should have byr field', () => {
      const passport = {
        ecl: 'gry',
        pid: '860033327',
        eyr: 2020,
        hcl: '#fffffd',
        iyr: 2017,
        hgt: '183cm'
      };
      const valid = isValid(passport);
      expect(valid).toBe(false);
    });
    test('should find puzzle 1 example answer', () => {
      const { length } = input
        .split('\n\n')
        .map(createPassportFrom)
        .filter(isValid);
      expect(length).toBe(2);
    });
    test('should find puzzle 1 answer', () => {
      const { length } = puzzle1Input
        .split('\n\n')
        .map(createPassportFrom)
        .filter(isValid);
      expect(length).toBe(204);
    });
  });
});
