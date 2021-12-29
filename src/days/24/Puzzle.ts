import Puzzle from '../../types/AbstractPuzzle';

type StateIndexes = 'w' | 'x' | 'y' | 'z';

type State = {
  w: number;
  x: number;
  y: number;
  z: number;
};

const ALU = (state: State) => ({
  inp: (a: StateIndexes, b: number) => {
    state[a] = b;
  },
  add: (a: StateIndexes, b: number | StateIndexes) => {
    state[a] += state[b as StateIndexes] ?? (+b as number);
  },
  mul: (a: StateIndexes, b: number | StateIndexes) => {
    state[a] *= state[b as StateIndexes] ?? (+b as number);
  },
  div: (a: StateIndexes, b: number | StateIndexes) => {
    state[a] = Math.trunc(
      state[a] / (state[b as StateIndexes] ?? (+b as number))
    );
  },
  mod: (a: StateIndexes, b: number | StateIndexes) => {
    state[a] = state[a] % (state[b as StateIndexes] ?? (+b as number));
  },
  eql: (a: StateIndexes, b: number | StateIndexes) => {
    state[a] =
      state[a] === (state[b as StateIndexes] ?? (+b as number)) ? 1 : 0;
  },
});

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    /*
     * SOLUTION FOUND WITH EXCELL SHEET CHECKING THE INPUT
     * THIS PROGRAM ONLY VERIFIES SOLUTIONS
     */
    const serial = '99196997985942';
    return this.checkValidSolution(serial) ? serial : undefined;
  }

  private checkValidSolution(solution: string) {
    const groups = [];
    const lines = this.input.split('\n');
    for (let i = 0; i < lines.length; i += 18) {
      const newGroup = [...lines.slice(i, i + 18)];
      groups.push(newGroup);
    }
    const instructionGroups: {
      op: string;
      first: StateIndexes;
      second: number | StateIndexes;
    }[][] = [];
    for (const group of groups) {
      const g: {
        op: string;
        first: StateIndexes;
        second: number | StateIndexes;
      }[] = group.reduce((acc, next) => {
        const [op, first, second] = next.split(' ');
        acc.push({ op: op, first: first, second: second ?? null });
        return acc;
      }, []);
      instructionGroups.push(g);
    }

    const serial = solution.split('').map(Number);

    let state = { w: 0, x: 0, y: 0, z: 0 };
    let i = 0;
    for (const digit of serial) {
      state = this.runAluOnState(state, digit, instructionGroups[i++]);
    }

    return state.z === 0;
  }

  private runAluOnState(
    state: State,
    digit: number,
    program: {
      op: string;
      first: StateIndexes;
      second: number | StateIndexes;
    }[]
  ) {
    const alu = ALU(state);
    for (const instruction of program) {
      if (instruction.op === 'inp') {
        alu[instruction.op as 'inp'](instruction.first, digit);
      } else {
        alu[instruction.op as 'mul' | 'add' | 'div' | 'mod' | 'eql'](
          instruction.first,
          instruction.second
        );
      }
    }
    return state;
  }

  public getFirstExpectedResult(): string {
    return '99196997985942';
  }

  public solveSecond(): string {
    const serial = '84191521311611';
    return this.checkValidSolution(serial) ? serial : undefined;
  }

  public getSecondExpectedResult(): string {
    return '84191521311611';
  }
}
