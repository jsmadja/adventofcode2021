import puzzle1Input from './puzzle1Input';

interface Command {
  argument: number;
  name: string;
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
});
