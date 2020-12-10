import _ from 'lodash';
import puzzle1Input from './puzzle1Input';

interface Bag {
  name: string;
  bags?: Bag[];
}

function createBagFrom(rule: string, onlyOneOccurrence: boolean = false) {
  const bagName = rule.split('bags contain')[0].trim();
  if (rule.indexOf('no other bags') >= 0) {
    return { name: bagName };
  }
  const typesOfbags = rule
    .split('bags contain')[1]
    .trim()
    .split('.')[0]
    .split(', ')
    .map((bagDescripion) => {
      const num = +bagDescripion.split(' ')[0];
      const strings = bagDescripion.split(' ');
      const name = strings.slice(1, strings.length - 1).join(' ');
      return _.range(onlyOneOccurrence ? 1 : num).map(() => ({
        name
      }));
    });
  return {
    name: bagName,
    bags: _.flatMap(typesOfbags)
  };
}

function canContain(allBags: Bag[], rule: Bag, color: string) {
  if (!rule) {
    return false;
  }
  if (rule.name === color) {
    return true;
  }
  if (!rule.bags) {
    return false;
  }
  return !!rule.bags.find((b) => {
    const bagDefinition = allBags.find((bx) => bx.name === b.name);
    return canContain(allBags, bagDefinition, color);
  });
}

function getContainablesCountOf(rules: Bag[], color: string) {
  return (
    rules.map((rule) => canContain(rules, rule, color)).filter((s) => !!s)
      .length - 1
  );
}

function getSizeOf(bag, bags) {
  if (!bag.bags) {
    return 0;
  }
  return bag.bags
    .map((b) => {
      const bagDefinition = bags.find((z) => z.name === b.name);
      return getSizeOf(bagDefinition, bags) + 1;
    })
    .reduce((a, b) => a + b, 0);
}

function getShinyGoldBag(
  bagRules: ({ name: string } | { bags: any; name: string })[]
) {
  return bagRules.find((b) => b.name === 'shiny gold');
}

const BAGS_EXAMPLE = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`;
describe('Day 7', () => {
  describe('Part 1', () => {
    const lightRed = {
      name: 'light red',
      bags: [
        {
          name: 'bright white'
        },
        {
          name: 'muted yellow'
        },
        {
          name: 'muted yellow'
        }
      ]
    } as Bag;

    test('can build a light red bags', () => {
      expect(lightRed).toBeTruthy();
    });
    test('can create light red bag from string', () => {
      const rule =
        'light red bags contain 1 bright white bag, 2 muted yellow bags.';
      const parsedBag = createBagFrom(rule);
      expect(parsedBag).toStrictEqual(lightRed);
    });
    test('can create mirrored yellow bag from string', () => {
      const rule =
        // eslint-disable-next-line max-len
        'mirrored yellow bags contain 1 dull maroon bag, 2 posh orange bags, 3 striped lime bags, 4 plaid crimson bags.';
      const parsedBag = createBagFrom(rule);
      expect(parsedBag).toStrictEqual({
        name: 'mirrored yellow',
        bags: [
          {
            name: 'dull maroon'
          },
          {
            name: 'posh orange'
          },
          {
            name: 'posh orange'
          },
          {
            name: 'striped lime'
          },
          {
            name: 'striped lime'
          },
          {
            name: 'striped lime'
          },
          {
            name: 'plaid crimson'
          },
          {
            name: 'plaid crimson'
          },
          {
            name: 'plaid crimson'
          },
          {
            name: 'plaid crimson'
          }
        ]
      });
    });
    test('can create shiny purple bags', () => {
      const rule = 'shiny purple bags contain no other bags.';
      const parsedBag = createBagFrom(rule);
      expect(parsedBag).toStrictEqual({
        name: 'shiny purple'
      });
    });
    test('should get example puzzle 1 answer', () => {
      const bagRules = BAGS_EXAMPLE.split('\n').map(createBagFrom);

      const count = getContainablesCountOf(bagRules, 'shiny gold');
      expect(count).toBe(4);
    });
    test('should get puzzle 1 answer', () => {
      const bagRules = puzzle1Input
        .split('\n')
        .map((n) => createBagFrom(n, true));
      const count = getContainablesCountOf(bagRules, 'shiny gold');
      expect(count).toBe(235);
    });
    test('simple contain', () => {
      const blue = {
        name: 'blue',
        bags: [{ name: 'red' }]
      };
      const red = {
        name: 'red'
      };
      const contains = canContain([blue, red], blue, 'red');

      expect(contains).toBe(true);
    });
    test('two level contain', () => {
      const bagBlue = {
        name: 'blue',
        bags: [{ name: 'red' }]
      };
      const bagRed = {
        name: 'red',
        bags: [{ name: 'yellow' }]
      };
      const bagYellow = {
        name: 'yellow'
      };

      const allBags = [bagBlue, bagRed, bagYellow];

      const contains = canContain(allBags, bagBlue, 'yellow');

      expect(contains).toBe(true);
    });
  });
  describe('Part 2', () => {
    test('example puzzle 2', () => {
      const bagRules = BAGS_EXAMPLE.split('\n').map((s) =>
        createBagFrom(s, false)
      );
      const shiny = getShinyGoldBag(bagRules);
      expect(getSizeOf(shiny, bagRules)).toBe(32);
    });
    test('puzzle 2', () => {
      const bags = puzzle1Input.split('\n').map((s) => createBagFrom(s, false));
      const shiny = getShinyGoldBag(bags);
      expect(getSizeOf(shiny, bags)).toBe(158493);
    });
  });
});
