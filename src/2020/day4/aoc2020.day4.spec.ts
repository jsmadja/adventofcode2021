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

const validPassport = {
  ecl: 'gry',
  pid: '860033327',
  eyr: 2020,
  hcl: '#fffffd',
  byr: 1937,
  iyr: 2017,
  hgt: '183cm',
  cid: 350
};

const EYE_COLORS = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

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

const CM = 'cm';

const IN = 'in';

function isValid(passport: Passport) {
  if (
    !passport.ecl ||
    !passport.pid ||
    !passport.eyr ||
    !passport.hcl ||
    !passport.byr ||
    !passport.iyr ||
    !passport.hgt
  ) {
    return false;
  }

  if (passport.byr < 1920 || passport.byr > 2002) {
    return false;
  }
  if (passport.iyr < 2010 || passport.iyr > 2020) {
    return false;
  }
  if (passport.eyr < 2020 || passport.eyr > 2030) {
    return false;
  }
  if (!passport.hgt.endsWith(CM) && !passport.hgt.endsWith(IN)) {
    return false;
  }
  if (
    passport.hgt.endsWith(CM) &&
    (+passport.hgt.split(CM)[0] < 150 || +passport.hgt.split(CM)[0] > 193)
  ) {
    return false;
  }
  if (
    passport.hgt.endsWith(IN) &&
    (+passport.hgt.split(IN)[0] < 59 || +passport.hgt.split(IN)[0] > 76)
  ) {
    return false;
  }
  const matchedColor = passport.hcl.match('#[0-9a-f]{6}');
  if (!matchedColor || matchedColor[0] !== passport.hcl) {
    return false;
  }
  if (EYE_COLORS.indexOf(passport.ecl) < 0) {
    return false;
  }
  const matchedPid = passport.pid.match('[0-9]{9}');
  return !(!matchedPid || matchedPid[0] !== passport.pid);
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
      expect(length).toBe(179);
    });
  });
  describe('Part 2', () => {
    test('Valid passport should have a byr between 1920 and 2002 ', () => {
      expect(isValid({ ...validPassport, byr: 1919 })).toBe(false);
      expect(isValid({ ...validPassport, byr: 1920 })).toBe(true);
      expect(isValid({ ...validPassport, byr: 2002 })).toBe(true);
      expect(isValid({ ...validPassport, byr: 2003 })).toBe(false);
    });
    test('Valid passport should have an iyr between 2010 and 2020 ', () => {
      expect(isValid({ ...validPassport, iyr: 2009 })).toBe(false);
      expect(isValid({ ...validPassport, iyr: 2010 })).toBe(true);
      expect(isValid({ ...validPassport, iyr: 2020 })).toBe(true);
      expect(isValid({ ...validPassport, iyr: 2021 })).toBe(false);
    });
    test('Valid passport should have an eyr between 2020 and 2030 ', () => {
      expect(isValid({ ...validPassport, eyr: 2019 })).toBe(false);
      expect(isValid({ ...validPassport, eyr: 2020 })).toBe(true);
      expect(isValid({ ...validPassport, eyr: 2030 })).toBe(true);
      expect(isValid({ ...validPassport, eyr: 2031 })).toBe(false);
    });
    test('Valid passport should have a valid hgt ', () => {
      expect(isValid({ ...validPassport, hgt: '149cm' })).toBe(false);
      expect(isValid({ ...validPassport, hgt: '150cm' })).toBe(true);
      expect(isValid({ ...validPassport, hgt: '190cm' })).toBe(true);
      expect(isValid({ ...validPassport, hgt: '193cm' })).toBe(true);
      expect(isValid({ ...validPassport, hgt: '194cm' })).toBe(false);

      expect(isValid({ ...validPassport, hgt: '58in' })).toBe(false);
      expect(isValid({ ...validPassport, hgt: '59in' })).toBe(true);
      expect(isValid({ ...validPassport, hgt: '60in' })).toBe(true);
      expect(isValid({ ...validPassport, hgt: '76in' })).toBe(true);
      expect(isValid({ ...validPassport, hgt: '77in' })).toBe(false);
      expect(isValid({ ...validPassport, hgt: '190in' })).toBe(false);

      expect(isValid({ ...validPassport, hgt: '190' })).toBe(false);
    });
    test('Valid passport should have a hair color # followed by exactly six characters 0-9 or a-f', () => {
      expect(isValid({ ...validPassport, hcl: 'a' })).toBe(false);
      expect(isValid({ ...validPassport, hcl: '#000fff' })).toBe(true);
      expect(isValid({ ...validPassport, hcl: '#123abc' })).toBe(true);
      expect(isValid({ ...validPassport, hcl: '#123abg' })).toBe(false);
    });
    test('Valid passport should have an eye color exactly one of: amb blu brn gry grn hzl oth', () => {
      expect(isValid({ ...validPassport, ecl: 'a' })).toBe(false);
      EYE_COLORS.forEach((ecl) =>
        expect(isValid({ ...validPassport, ecl })).toBe(true)
      );
    });
    test('Valid passport should have a pid a nine-digit number, including leading zeroes', () => {
      expect(isValid({ ...validPassport, pid: 'a' })).toBe(false);
      expect(isValid({ ...validPassport, pid: '000000001' })).toBe(true);
      expect(isValid({ ...validPassport, pid: '0123456789' })).toBe(false);
    });
    test('should find puzzle 2 answer', () => {
      const { length } = puzzle1Input
        .split('\n\n')
        .map(createPassportFrom)
        .filter(isValid);
      expect(length).toBe(179);
    });
  });
});
