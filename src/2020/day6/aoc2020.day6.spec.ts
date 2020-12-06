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

function getOnlyAllYesAnswerCount(allYesAnswers: string) {
  const forms = allYesAnswers.split('\n');
  const allLetters = forms.join('').split('');
  return _(allLetters)
    .countBy((a) => a)
    .values()
    .filter((l) => l === forms.length)
    .value().length;
}

function getOnlyYesAnswerCountOfForms(forms: string) {
  return forms
    .split('\n\n')
    .map(getOnlyAllYesAnswerCount)
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
  describe('Part 2', () => {
    test('should pass acceptance tests', () => {
      expect(
        getOnlyAllYesAnswerCount(`abcx
abcy
abcz`)
      ).toBe(3);
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
      expect(getOnlyYesAnswerCountOfForms(forms)).toBe(6);
    });
    test('should get puzzle 2 answer', () => {
      expect(getOnlyYesAnswerCountOfForms(puzzle1Input)).toBe(3219);
    });
  });
});
