import _ from 'lodash';
import puzzle1Input from './puzzle1Input';

class Adapter {
  next: Adapter;

  constructor(public joltage: number) {
    this.joltage = joltage;
  }

  isPluggableTo(adapter: Adapter) {
    return Math.abs(this.joltage - adapter.joltage) < 4;
  }

  plugTo(adapter: Adapter) {
    this.next = adapter;
  }

  getJoltageDifference() {
    if (this.next) {
      return Math.abs(this.joltage - this.next.joltage);
    }
    return undefined;
  }

  hasNext(): boolean {
    return !!this.next;
  }
}

function autoPlug(
  adapters: Adapter[],
  adapter: Adapter = undefined,
  first: Adapter = undefined
) {
  if (adapters.length > 0) {
    adapters.sort((a, b) => a.joltage - b.joltage);
    const pluggable = adapters[0];
    const availableAdapters = adapters.slice(1);
    if (adapter !== undefined) {
      adapter.plugTo(pluggable);
      return autoPlug(availableAdapters, pluggable, first);
    }
    return autoPlug(availableAdapters, pluggable, pluggable);
  }
  return first;
}

function computeDifferences(
  currentAdapter: Adapter,
  differences: number[] = []
) {
  if (differences.length === 0) {
    differences.push(currentAdapter.joltage);
  }
  if (currentAdapter.hasNext()) {
    const joltageDifference = currentAdapter.getJoltageDifference();
    differences.push(joltageDifference);
    return computeDifferences(currentAdapter.next, differences);
  }
  const countBy = _.countBy(differences);
  if (countBy['3']) {
    countBy['3']++;
  }
  return countBy;
}

function getPuzzle1Solution(str: string) {
  const adapters = str.split('\n').map((s) => new Adapter(+s));
  const adapter = autoPlug(adapters);
  const differences = computeDifferences(adapter);
  return differences['1'] * differences['3'];
}

describe('Day 10', () => {
  describe('Part 1', () => {
    test('should create an adapter', () => {
      const adapter = new Adapter(3);
      expect(adapter).toMatchObject({ joltage: 3 });
    });
    test('Two adapters with same joltage are pluggable each others', () => {
      const adapter1 = new Adapter(3);
      const adapter2 = new Adapter(3);
      expect(adapter1.isPluggableTo(adapter2)).toBe(true);
    });
    test('Two adapters with +1 difference joltage are pluggable each others', () => {
      const adapter1 = new Adapter(3);
      const adapter2 = new Adapter(4);
      expect(adapter1.isPluggableTo(adapter2)).toBe(true);
    });
    test('Two adapters with +2 difference joltage are pluggable each others', () => {
      const adapter1 = new Adapter(3);
      const adapter2 = new Adapter(5);
      expect(adapter1.isPluggableTo(adapter2)).toBe(true);
    });
    test('Two adapters with +3 difference joltage are pluggable each others', () => {
      const adapter1 = new Adapter(3);
      const adapter2 = new Adapter(6);
      expect(adapter1.isPluggableTo(adapter2)).toBe(true);
    });
    test('Two adapters with difference of 4 jolts are not pluggable each others', () => {
      const adapter1 = new Adapter(3);
      const adapter2 = new Adapter(7);
      expect(adapter1.isPluggableTo(adapter2)).toBe(false);
    });
    test('Can compute difference of two plugged adapters', () => {
      const adapter1 = new Adapter(3);
      const adapter2 = new Adapter(6);
      adapter1.plugTo(adapter2);
      expect(adapter1.getJoltageDifference()).toBe(3);
    });
    test('Can count all differences for plugged adapter', () => {
      const adapter1 = new Adapter(3);
      const adapter2 = new Adapter(6);
      const adapter3 = new Adapter(7);
      adapter1.plugTo(adapter2);
      adapter2.plugTo(adapter3);

      const differences = computeDifferences(adapter1);
      expect(differences['0']).toBe(undefined);
      expect(differences['1']).toBe(1);
      expect(differences['2']).toBe(undefined);
      expect(differences['3']).toBe(3);
    });
    test('should autoplug adapters', () => {
      const adapter1 = new Adapter(1);
      const adapter2 = new Adapter(2);
      const adapter3 = new Adapter(3);

      const adapter = autoPlug([adapter3, adapter1, adapter2]);

      expect(adapter.joltage).toStrictEqual(1);
      expect(adapter.next.joltage).toStrictEqual(2);
      expect(adapter.next.next.joltage).toStrictEqual(3);
      expect(adapter.next.next.hasNext()).toBe(false);
    });
    test('should pass example', () => {
      const str = `16
10
15
5
1
11
7
19
6
12
4`;
      const solution = getPuzzle1Solution(str);
      expect(solution).toBe(35);
    });
    test('should pass 2nd example', () => {
      const str = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`;
      const solution = getPuzzle1Solution(str);
      expect(solution).toBe(220);
    });
    test('should pass puzzle 1', () => {
      const solution = getPuzzle1Solution(puzzle1Input);
      expect(solution).toBe(1914);
    });
  });
  describe('Part 2', () => {});
});
