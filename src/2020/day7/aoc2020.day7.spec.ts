import _ from 'lodash';
import puzzle1Input from './puzzle1Input';

interface Bag {
  name: string;
  bags?: Bag[];
}

function createBagFrom(rule: string) {
  const bagName = rule.split('bags contain')[0].trim();
  if (rule.indexOf('no other bags') >= 0) {
    return { name: bagName };
  }
  const typesOfbags = rule
    .split('bags contain')[1]
    .trim()
    .split('.')[0]
    .split(', ')
    .map((bagDescripiont) => {
      const num = +bagDescripiont.split(' ')[0];
      const strings = bagDescripiont.split(' ');
      const name = strings.slice(1, strings.length - 1).join(' ');
      /*
        return _.range(num).map((n) => ({
          name
        })); */
      return { name };
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

function findAnswer(rules: Bag[], color: string) {
  return (
    rules.map((rule) => canContain(rules, rule, color)).filter((s) => !!s)
      .length - 1
  );
}

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
            name: 'striped lime'
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
      const bagRules = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`
        .split('\n')
        .map(createBagFrom);

      const count = findAnswer(bagRules, 'shiny gold');
      expect(count).toBe(4);
    });
    test('should get puzzle 1 answer', () => {
      const bagRules = puzzle1Input.split('\n').map(createBagFrom);
      const count = findAnswer(bagRules, 'shiny gold');
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
});
