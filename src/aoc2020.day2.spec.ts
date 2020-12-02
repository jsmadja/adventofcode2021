import input from './2020/day2/input';

interface Policy {
  repetitionRange: {
    min: number;
    max: number;
  };
  letter: string;
}

interface TobogganPolicy {
  exclusivePosition: {
    first: number;
    second: number;
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

  validateToboggan(policy: TobogganPolicy) {
    const letter1 = this.password[policy.exclusivePosition.first - 1];
    const letter2 = this.password[policy.exclusivePosition.second - 1];
    return (
      (letter1 === policy.letter || letter2 === policy.letter) &&
      letter1 !== letter2
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

function toTobogganPolicy(policyString: string): TobogganPolicy {
  const [range, letter] = policyString.split(' ');
  const [first, second] = range.split('-');
  return {
    exclusivePosition: {
      first: +first,
      second: +second
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

function parseInputLine2(line) {
  const [policyString, passwordString] = line
    .split(':')
    .map((parts) => parts.trim());
  const password = new Password(passwordString);
  const policy = toTobogganPolicy(policyString);
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
  describe('Part 2', () => {
    test('1-3 a: abcde is a valid password with Toboggan policy', () => {
      const policy = {
        exclusivePosition: {
          first: 1,
          second: 3
        },
        letter: 'a'
      } as TobogganPolicy;
      const password = new Password('abcde');
      expect(password.validateToboggan(policy)).toBe(true);
    });
    test('1-3 b: cdefg is not a valid password with Toboggan policy', () => {
      const policy = {
        exclusivePosition: {
          first: 1,
          second: 3
        },
        letter: 'b'
      } as TobogganPolicy;
      const password = new Password('cdefg');
      expect(password.validateToboggan(policy)).toBe(false);
    });
    test('2-9 c: ccccccccc is not a valid password with Toboggan policy', () => {
      const policy = {
        exclusivePosition: {
          first: 2,
          second: 9
        },
        letter: 'c'
      } as TobogganPolicy;
      const password = new Password('ccccccccc');
      expect(password.validateToboggan(policy)).toBe(false);
    });
    test('should validate puzzle 2', () => {
      const count = input
        .map(parseInputLine2)
        .filter(({ policy, password }) => password.validateToboggan(policy))
        .length;
      expect(count).toBe(263);
    });
  });
});
