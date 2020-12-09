import puzzle1Input from './puzzle1Input';

interface Command {
  name: string;
  argument: number;
}

interface State {
  offset: number;
  accumulator: number;
  history: any[];
}

function parseCommand(str: string): Command {
  const splits = str.split(' ');
  return {
    name: splits[0],
    argument: +splits[1]
  };
}

function execute(command: Command, state: State) {
  const newState = {
    ...state,
    history: state.history.concat(state.offset)
  };
  if (command.name === 'acc') {
    newState.accumulator += command.argument;
    newState.offset = state.offset + 1;
  }
  if (command.name === 'nop') {
    newState.offset = state.offset + 1;
  }
  if (command.name === 'jmp') {
    newState.offset += command.argument;
  }
  return newState;
}

function executeInstructions(
  instructions: Command[],
  state: State = { accumulator: 0, offset: 0, history: [] }
): State {
  const instruction = instructions[state.offset];
  const newState = execute(instruction, state);
  if (state.history.indexOf(newState.offset) >= 0) {
    return state;
  }
  if (state.offset < instructions.length - 1) {
    return executeInstructions(instructions, newState);
  }
  return newState;
}

function isLooping(
  instructions: Command[],
  state: State = { accumulator: 0, offset: 0, history: [] }
) {
  const instruction = instructions[state.offset];
  const newState = execute(instruction, state);
  if (state.history.indexOf(newState.offset) >= 0) {
    return true;
  }
  if (state.offset < instructions.length - 1) {
    return isLooping(instructions, newState);
  }
  return false;
}

function substituteNopJmpInstruction(instruction: Command) {
  if (instruction.name === 'nop') {
    return { ...instruction, name: 'jmp' };
  }
  if (instruction.name === 'jmp') {
    return { ...instruction, name: 'nop' };
  }
  return instruction;
}

function createNewSets(instructions: Command[]): Command[][] {
  const sets = [];
  for (let offset = 0; offset < instructions.length; offset++) {
    const currentInstruction = instructions[offset];
    if (
      currentInstruction.name === 'jmp' ||
      currentInstruction.name === 'nop'
    ) {
      const newSet = instructions.slice();
      newSet[offset] = substituteNopJmpInstruction(instructions[offset]);
      sets.push(newSet);
    }
  }
  return sets;
}

describe('Day 8', () => {
  describe('Part 1', () => {
    test('should create nop instruction', () => {
      expect(parseCommand('nop +0')).toStrictEqual({
        name: 'nop',
        argument: 0
      });
    });
    test('should create acc instruction', () => {
      expect(parseCommand('acc +1')).toStrictEqual({
        name: 'acc',
        argument: 1
      });
    });
    test('should create jmp instruction', () => {
      expect(parseCommand('jmp -4')).toStrictEqual({
        name: 'jmp',
        argument: -4
      });
    });
    test('nop command should just increment offset', () => {
      const nop = {
        name: 'nop',
        argument: 0
      };
      const state = execute(nop, { accumulator: 0, offset: 0, history: [] });
      expect(state).toStrictEqual({ accumulator: 0, offset: 1, history: [0] });
    });
    test('acc command should increment acc and increment offset', () => {
      const acc = {
        name: 'acc',
        argument: 4
      };
      const state = execute(acc, { accumulator: 0, offset: 0, history: [] });
      expect(state).toStrictEqual({ accumulator: 4, offset: 1, history: [0] });
    });
    test('jmp command should jump to new offset', () => {
      const jmp = {
        name: 'jmp',
        argument: 4
      };
      const state = execute(jmp, { accumulator: 0, offset: 1, history: [] });
      expect(state).toStrictEqual({ accumulator: 0, offset: 5, history: [1] });
    });
    test('should get accumulator after all execution', () => {
      const instructions = [
        {
          name: 'nop',
          argument: 0
        },
        {
          name: 'acc',
          argument: 4
        },
        {
          name: 'jmp',
          argument: 1
        },
        {
          name: 'acc',
          argument: 1
        }
      ];
      const state = executeInstructions(instructions);
      expect(state).toStrictEqual({
        accumulator: 5,
        offset: 4,
        history: [0, 1, 2, 3]
      });
    });

    test('should get accumulator after all execution without loop', () => {
      const instructions = [
        {
          name: 'nop',
          argument: 0
        },
        {
          name: 'acc',
          argument: 4
        },
        {
          name: 'jmp',
          argument: 1
        },
        {
          name: 'acc',
          argument: 1
        },
        {
          name: 'jmp',
          argument: -4
        }
      ];
      const state = executeInstructions(instructions);
      expect(state).toStrictEqual({
        accumulator: 5,
        offset: 4,
        history: [0, 1, 2, 3]
      });
    });
    test('should pass example', () => {
      const example = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;
      const instructions = example.split('\n').map(parseCommand);
      const state = executeInstructions(instructions);
      expect(state).toStrictEqual({
        accumulator: 5,
        offset: 4,
        history: [0, 1, 2, 6, 7, 3]
      });
    });
    test('should pass input', () => {
      const instructions = puzzle1Input.split('\n').map(parseCommand);
      const state = executeInstructions(instructions);
      expect(state.accumulator).toBe(1941);
    });
  });
  describe('Part 2', () => {
    test('should tell that instructions are looping', () => {
      const example = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;
      const instructions = example.split('\n').map(parseCommand);
      const looping = isLooping(instructions);
      expect(looping).toBe(true);
    });
    test('should create a new instruction with replacing nop to jmp', () => {
      expect(
        substituteNopJmpInstruction({
          name: 'nop',
          argument: 0
        })
      ).toStrictEqual({
        name: 'jmp',
        argument: 0
      });
    });
    test('should create a new instruction with replacing jmp to nop', () => {
      expect(
        substituteNopJmpInstruction({
          name: 'jmp',
          argument: 0
        })
      ).toStrictEqual({
        name: 'nop',
        argument: 0
      });
    });
    test('should not create a new instruction for acc', () => {
      expect(
        substituteNopJmpInstruction({
          name: 'acc',
          argument: 0
        })
      ).toStrictEqual({
        name: 'acc',
        argument: 0
      });
    });
    test('should generate new instructions sets', () => {
      const instructions = [
        {
          name: 'nop',
          argument: 0
        },
        {
          name: 'jmp',
          argument: 1
        }
      ];
      expect(createNewSets(instructions)).toStrictEqual([
        [
          { name: 'jmp', argument: 0 },
          { name: 'jmp', argument: 1 }
        ],
        [
          { name: 'nop', argument: 0 },
          { name: 'nop', argument: 1 }
        ]
      ]);
    });
    test('shoud compute the non-looping set', () => {
      const instructions = puzzle1Input.split('\n').map(parseCommand);
      const sets = createNewSets(instructions);
      const validSet = sets.find((set) => !isLooping(set));
      const state = executeInstructions(validSet);
      expect(state.accumulator).toBe(2096);
    });
  });
});
