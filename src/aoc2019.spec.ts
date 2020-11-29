import each from 'jest-each';

type Mass = number;
type Fuel = number;

function calculateRequiredFuel(mass: Mass): Fuel {
  return Math.max(Math.floor(mass / 3) - 2, 0);
}

function calculateTrueRequiredFuel(mass: Mass): Fuel {
  if (mass > 0) {
    const requiredFuel = calculateRequiredFuel(mass);
    return requiredFuel + calculateTrueRequiredFuel(requiredFuel);
  }
  return 0;
}

describe('Day 1', () => {
  const input = `118602
60644
136064
134771
62530
129043
120233
126092
112839
86210
132501
75894
109369
83641
92700
64983
90418
130659
92555
104100
121330
87819
63021
138752
108491
113214
136107
55602
131025
90689
132480
134220
135760
148945
57010
115909
67605
108478
111094
129875
102541
133169
76547
113079
126981
81066
104994
134551
61053
136512
67895
127712
58077
107426
115178
99316
64532
107293
129534
114100
88382
133621
93803
107214
75795
51422
50876
98171
121970
92130
89814
130753
58561
61666
144353
142168
143592
94461
116978
135420
88165
97926
114772
143455
53613
60408
94299
98996
142167
78063
98974
65392
140263
126726
141285
111074
95977
124871
136636
81935`;
  describe('Part 1', () => {
    const testData = [
      [12, 2],
      [14, 2],
      [1969, 654],
      [100756, 33583],
    ];

    each(testData).test(
      'For a mass of %d, the fuel required is %d',
      (mass, requiredFuel) => {
        expect(calculateRequiredFuel(mass)).toBe(requiredFuel);
      },
    );

    test('should compute full required fuel', () => {
      expect(
        input
          .split('\n')
          .map((mass) => calculateRequiredFuel(+mass))
          .reduce((accumulator, requiredFuel) => accumulator + requiredFuel, 0),
      ).toBe(3479429);
    });
  });

  describe('Part 2', () => {
    test(`A module of mass 14 requires 2 fuel. This fuel requires no further fuel (2 divided by 3 and rounded down
     is 0, which would call for a negative fuel), so the total fuel required is still just 2`, () => {
      expect(calculateTrueRequiredFuel(14)).toBe(2);
    });

    test(`At first, a module of mass 1969 requires 654 fuel. Then, this fuel requires 216 more fuel (654 / 3 - 2).216
       then requires 70 more fuel, which requires 21 fuel, which requires 5 fuel, which requires no furtherfuel. So, the
        total fuel required for a module of mass 1969 is 654 + 216 + 70 + 21 + 5 = 966.`, () => {
      expect(calculateTrueRequiredFuel(1969)).toBe(966);
    });

    test(`The fuel required by a module of mass 100756 and its fuel is: 33583 + 11192 + 3728 + 1240 + 411 + 135 + 
    43 + 12 + 2 = 50346.
`, () => {
      expect(calculateTrueRequiredFuel(100756)).toBe(50346);
    });

    test('should compute true full required fuel', () => {
      expect(
        input
          .split('\n')
          .map((mass) => calculateTrueRequiredFuel(+mass))
          .reduce((accumulator, requiredFuel) => accumulator + requiredFuel, 0),
      ).toBe(5216273);
    });
  });
});
