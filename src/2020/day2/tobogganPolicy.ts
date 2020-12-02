import { Password } from './password';

export class TobogganPolicy {
  private exclusivePosition: {
    first: number;
    second: number;
  };

  private letter: string;

  constructor(first, second, letter) {
    this.exclusivePosition = { first, second };
    this.letter = letter;
  }

  validate(password: Password) {
    const letter1 = password[this.exclusivePosition.first - 1];
    const letter2 = password[this.exclusivePosition.second - 1];
    return (
      (letter1 === this.letter || letter2 === this.letter) &&
      letter1 !== letter2
    );
  }
}

export function toTobogganPolicy(policyString: string): TobogganPolicy {
  const [range, letter] = policyString.split(' ');
  const [first, second] = range.split('-');
  return new TobogganPolicy(first, second, letter);
}
