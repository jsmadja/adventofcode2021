import _ from 'lodash';
import puzzle1Input from './puzzle1Input';

function getYesAnswerCount(allYesAnswers: string) {
  const allLetters = allYesAnswers.split('\n').join('').split('');
  return _.uniq(allLetters).length;
}

function getYesAnswerCountOfForms(forms: string) {
  return forms
    .split('\n\n')
    .map(getYesAnswerCount)
    .reduce((a, b) => a + b, 0);
}

describe('Day 6', () => {
  describe('Part 1', () => {
    test('should pass acceptance tests', () => {
      expect(
        getYesAnswerCount(`abcx
abcy
abcz`)
      ).toBe(6);
    });
    test('should sum all forms', () => {
      const forms = `abc

a
b
c

ab
ac

a
a
a
a

b`;
      expect(getYesAnswerCountOfForms(forms)).toBe(11);
    });
    test('should get puzzle 1 answer', () => {
      expect(getYesAnswerCountOfForms(puzzle1Input)).toBe(6596);
    });
  });
});
