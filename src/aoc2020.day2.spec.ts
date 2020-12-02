import input from './2020/day2/input';

interface Policy {
  repetitionRange: {
    min: number;
    max: number;
  };
  letter: string;
}

class Password {
  private password: string;

  constructor(password: string) {
    this.password = password;
  }

  validate(policy: Policy) {
    const charCount = this.password.split('').filter((c) => c === policy.letter)
      .length;
    return (
      charCount >= policy.repetitionRange.min &&
      charCount <= policy.repetitionRange.max
    );
  }
}

function toPolicy(policyString: string) {
  const [range, letter] = policyString.split(' ');
  const [min, max] = range.split('-');
  return {
    repetitionRange: {
      min: +min,
      max: +max
    },
    letter
  };
}

function parseInputLine(line) {
  const [policyString, passwordString] = line
    .split(':')
    .map((parts) => parts.trim());
  const password = new Password(passwordString);
  const policy = toPolicy(policyString);
  return { policy, password };
}

describe('Day 2', () => {
  describe('Part 1', () => {
    test('1-3 a: abcde is a valid password', () => {
      const policy = {
        repetitionRange: {
          min: 1,
          max: 3
        },
        letter: 'a'
      } as Policy;
      const password = new Password('abcde');
      expect(password.validate(policy)).toBe(true);
    });
    test('1-3 b: cdefg is not a valid password', () => {
      const policy = {
        repetitionRange: {
          min: 1,
          max: 3
        },
        letter: 'b'
      } as Policy;
      const password = new Password('cdefg');
      expect(password.validate(policy)).toBe(false);
    });
    test('2-9 c: ccccccccc is a valid password', () => {
      const policy = {
        repetitionRange: {
          min: 2,
          max: 9
        },
        letter: 'c'
      } as Policy;
      const password = new Password('ccccccccc');
      expect(password.validate(policy)).toBe(true);
    });
    test('should count valid password', () => {
      const testInput = `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`;
      const count = testInput
        .split('\n')
        .map(parseInputLine)
        .filter(({ policy, password }) => password.validate(policy)).length;
      expect(count).toBe(2);
    });
    test('should validate puzzle 1', () => {
      const count = input
        .map(parseInputLine)
        .filter(({ policy, password }) => password.validate(policy)).length;
      expect(count).toBe(622);
    });
  });
});
