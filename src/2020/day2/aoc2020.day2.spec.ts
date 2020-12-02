import input from './input';
import { Policy, toPolicy } from './policy';
import { TobogganPolicy, toTobogganPolicy } from './tobogganPolicy';
import { Password } from './password';

function parseInputLineOfPuzzle1(line): { policy: Policy; password: Password } {
  const [policyString, password] = line.split(':').map((parts) => parts.trim());
  const policy = toPolicy(policyString);
  return { policy, password };
}

function parseInputLineOfPuzzle2(
  line
): { policy: TobogganPolicy; password: Password } {
  const [policyString, password] = line.split(':').map((parts) => parts.trim());
  const policy = toTobogganPolicy(policyString);
  return { policy, password };
}

describe('Day 2', () => {
  describe('Part 1', () => {
    test('1-3 a: abcde is a valid password', () => {
      expect(new Policy(1, 3, 'a').validate('abcde')).toBe(true);
    });
    test('1-3 b: cdefg is not a valid password', () => {
      expect(new Policy(1, 3, 'b').validate('cdefg')).toBe(false);
    });
    test('2-9 c: ccccccccc is a valid password', () => {
      expect(new Policy(2, 9, 'c').validate('ccccccccc')).toBe(true);
    });
    test('should count valid password', () => {
      const testInput = `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`;
      const count = testInput
        .split('\n')
        .map(parseInputLineOfPuzzle1)
        .filter(({ policy, password }) => policy.validate(password)).length;
      expect(count).toBe(2);
    });
    test('should validate puzzle 1', () => {
      const count = input
        .map(parseInputLineOfPuzzle1)
        .filter(({ policy, password }) => policy.validate(password)).length;
      expect(count).toBe(622);
    });
  });
  describe('Part 2', () => {
    test('1-3 a: abcde is a valid password with Toboggan policy', () => {
      expect(new TobogganPolicy(1, 3, 'a').validate('abcde')).toBe(true);
    });
    test('1-3 b: cdefg is not a valid password with Toboggan policy', () => {
      expect(new TobogganPolicy(1, 3, 'b').validate('cdefg')).toBe(false);
    });
    test('2-9 c: ccccccccc is not a valid password with Toboggan policy', () => {
      expect(new TobogganPolicy(2, 9, 'c').validate('ccccccccc')).toBe(false);
    });
    test('should validate puzzle 2', () => {
      const count = input
        .map(parseInputLineOfPuzzle2)
        .filter(({ policy, password }) => policy.validate(password)).length;
      expect(count).toBe(263);
    });
  });
});
