import { Password } from './password';

export class Policy {
  private repetitionRange: { min: number; max: number };

  private letter: string;

  constructor(min, max, letter) {
    this.repetitionRange = {
      min,
      max
    };
    this.letter = letter;
  }

  validate(password: Password) {
    const charCount = password.split('').filter((c) => c === this.letter)
      .length;
    return (
      charCount >= this.repetitionRange.min &&
      charCount <= this.repetitionRange.max
    );
  }
}

export function toPolicy(policyString: string) {
  const [range, letter] = policyString.split(' ');
  const [min, max] = range.split('-');
  return new Policy(+min, +max, letter);
}
