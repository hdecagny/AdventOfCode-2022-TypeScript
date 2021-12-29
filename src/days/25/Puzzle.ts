import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const lines = this.input.split('\n');
    let state = new Array(lines);
    let newState = new Array(lines);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      state[i] = new Array(line.length);
      newState[i] = new Array(line.length);
      line.split('').map((element, j) => {
        state[i][j] = element;
        newState[i][j] = element;
      });
    }
    let changed = true;
    let stepsCounter = 0;
    while (changed) {
      changed = false;
      stepsCounter++;
      for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state[i].length; j++) {
          const element = state[i][j];
          if (element === '>') {
            if (state[i][(j + 1) % state[i].length] === '.') {
              changed = true;
              newState[i][(j + 1) % newState[i].length] = '>';
              newState[i][j] = '.';
            }
          }
        }
      }
      let tmp = state;
      state = newState;
      newState = tmp;

      newState = [];
      for (const line of state) {
        newState.push([...line]);
      }

      for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state[i].length; j++) {
          const element = state[i][j];
          if (element === 'v') {
            if (state[(i + 1) % lines.length][j] === '.') {
              changed = true;
              newState[(i + 1) % lines.length][j] = 'v';
              newState[i][j] = '.';
            }
          }
        }
      }
      tmp = state;
      state = newState;
      newState = tmp;
      newState = [];
      for (const line of state) {
        newState.push([...line]);
      }
    }

    return stepsCounter.toString();
  }

  public getFirstExpectedResult(): string {
    return '58';
  }

  public solveSecond(): string {
    return 'solution 2';
  }

  public getSecondExpectedResult(): string {
    return 'solution 2';
  }
}
