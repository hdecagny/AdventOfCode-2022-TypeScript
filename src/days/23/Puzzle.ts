import Puzzle from '../../types/AbstractPuzzle';

const COSTS = new Map<string, number>();
COSTS.set('A', 1);
COSTS.set('B', 10);
COSTS.set('C', 100);
COSTS.set('D', 1000);

const HALLWAY_POSITIONS = [0, 1, 3, 5, 7, 9, 10];

class AmphipodStack {
  private stack: string[];
  private size: number;
  private type: 'A' | 'B' | 'C' | 'D';
  private hallwayPosition: number;

  // private workIndex: number;

  constructor(size: number, type: 'A' | 'B' | 'C' | 'D') {
    this.type = type;
    this.size = size;
    this.stack = new Array(size).fill('.');
    // this.workIndex = 0;
    switch (type) {
      case 'A':
        this.hallwayPosition = 2;
        break;
      case 'B':
        this.hallwayPosition = 4;
        break;
      case 'C':
        this.hallwayPosition = 6;
        break;
      case 'D':
        this.hallwayPosition = 8;
        break;
    }
  }

  public getHallwayPosition() {
    return this.hallwayPosition;
  }

  public getSize() {
    return this.size;
  }

  // add in place of first '.'
  public pushBack(amphipod: string) {
    const addIndex = this.stack.indexOf('.');
    this.stack[addIndex] = amphipod;
  }

  public add(amphipod: string) {
    // this.stack[this.workIndex] = amphipod;
    // this.workIndex--;
    // if (this.workIndex < 0) {
    //   this.workIndex = 0;
    // }
    // return this.workIndex + 1;

    for (let i = 0; i < this.stack.length; i++) {
      if (this.stack[i] === '.') {
        this.stack[i] = amphipod;
        return i;
      }
    }
  }

  public peek() {
    for (let i = 0; i < this.stack.length; i++) {
      if (this.stack[i] !== '.') {
        return this.stack[i];
      }
    }
  }

  public pop() {
    // const toReturn = this.stack[this.workIndex];
    // this.stack[this.workIndex] = '.';
    // this.workIndex++;
    // if (this.workIndex >= this.stack.length) {
    //   this.workIndex = this.stack.length - 1;
    // }
    // return { value: toReturn, steps: this.workIndex };
    for (let i = 0; i < this.stack.length; i++) {
      if (this.stack[i] !== '.') {
        const toReturn = this.stack[i];
        this.stack[i] = '.';
        return {
          value: toReturn,
          steps: i,
        };
      }
    }
  }

  // can add, only if has items of same type
  public canPush(amphipod: string) {
    if (amphipod === this.type) {
      for (let i = 0; i < this.stack.length; i++) {
        if (this.stack[i] !== '.' && this.stack[i] !== amphipod) {
          return false;
        }
      }

      return true;
      // for (const currentAmphipod of this.stack) {
      //   if (currentAmphipod !== '.' && currentAmphipod !== this.type) {
      //     return false;
      //   }
      // }
    }
    return false;
  }

  // can pop if is not in destinationAlready and if there are items
  public canPop() {
    for (let i = 0; i < this.stack.length; i++) {
      if (this.stack[i] !== this.type && this.stack[i] !== '.') {
        return true;
      }
    }

    // const toPop = this.stack[this.workIndex];
    // if (toPop === '.') {
    //   return false;
    // }
    // if (toPop === this.type) {
    //   for (let i = 0; i < this.stack.length; i++) {
    //     if (i !== this.workIndex) {
    //       if (this.stack[i] !== '.' && this.stack[i] !== toPop) {
    //         return true;
    //       }
    //     }
    //   }
    // } else {
    //   return true;
    // }
    // return false;
  }

  public getValueAt(i: number) {
    return this.stack[i];
  }

  public stackToString() {
    return this.stack.join('');
  }

  public clone() {
    const newStack = new AmphipodStack(this.size, this.type);
    newStack.stack = this.stack.slice();
    // newStack.workIndex = this.workIndex;
    newStack.hallwayPosition = this.hallwayPosition;
    return newStack;
  }
}

type State = {
  hallway: string[];
  aStack: AmphipodStack;
  bStack: AmphipodStack;
  cStack: AmphipodStack;
  dStack: AmphipodStack;
  cost: number;
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return this.resolve(this.input.split('\n'));
  }

  private resolve(splitInput: string[]) {
    const stackSize = splitInput.length > 5 ? 4 : 2;
    const initialState: State = splitInput
      .slice(2, splitInput.length - 1)
      .reduce(
        (acc, next) => {
          const [a, b, c, d] = next.match(/\w/g);
          acc.aStack.pushBack(a);
          acc.bStack.pushBack(b);
          acc.cStack.pushBack(c);
          acc.dStack.pushBack(d);
          return acc;
        },
        {
          hallway: [],
          aStack: new AmphipodStack(stackSize, 'A'),
          bStack: new AmphipodStack(stackSize, 'B'),
          cStack: new AmphipodStack(stackSize, 'C'),
          dStack: new AmphipodStack(stackSize, 'D'),
          cost: 0,
        }
      );
    initialState.hallway[0] = '.';
    initialState.hallway[1] = '.';
    initialState.hallway[2] = '.';
    initialState.hallway[3] = '.';
    initialState.hallway[4] = '.';
    initialState.hallway[5] = '.';
    initialState.hallway[6] = '.';
    initialState.hallway[7] = '.';
    initialState.hallway[8] = '.';
    initialState.hallway[9] = '.';
    initialState.hallway[10] = '.';

    const toVisit = new Map<string, State>();
    const alreadyVisited = new Map<string, number>();
    toVisit.set(this.stateToString(initialState), initialState);

    let currentNode = initialState;
    while (toVisit.size > 0) {
      if (this.checkWinnerState(currentNode)) {
        return currentNode.cost.toString();
      }

      const adjs = this.getAdjacents(currentNode);
      for (const currentAdj of adjs) {
        const currentAdjAsString = this.stateToString(currentAdj);
        const alreadyVisitedNode = alreadyVisited.get(currentAdjAsString);
        if (alreadyVisitedNode) {
          if (currentNode.cost + currentAdj.cost < alreadyVisitedNode) {
            alreadyVisited.set(
              currentAdjAsString,
              currentNode.cost + currentAdj.cost
            );
            currentAdj.cost = currentNode.cost + currentAdj.cost;
            toVisit.set(currentAdjAsString, currentAdj);
          }
        } else {
          currentAdj.cost = currentNode.cost + currentAdj.cost;
          alreadyVisited.set(currentAdjAsString, currentAdj.cost);
          toVisit.set(currentAdjAsString, currentAdj);
        }
      }
      toVisit.delete(this.stateToString(currentNode));
      let min = Number.MAX_SAFE_INTEGER;
      for (const entry of toVisit) {
        const state = entry[1];
        if (state.cost < min) {
          min = state.cost;
          currentNode = state;
        }
      }
    }

    return '';
  }

  private stateToString(state: State) {
    let toReturn = '';
    for (let i = 0; i <= 10; i++) {
      toReturn = `${toReturn}${state.hallway[i]}`;
    }
    toReturn = `${toReturn}#`;
    toReturn = `${toReturn}#${state.aStack.stackToString()}#`;
    toReturn = `${toReturn}#${state.bStack.stackToString()}#`;
    toReturn = `${toReturn}#${state.cStack.stackToString()}#`;
    toReturn = `${toReturn}#${state.dStack.stackToString()}#`;
    return toReturn;
  }

  private checkWinnerState(state: State) {
    return state.aStack.getSize() === 2
      ? this.stateToString(state) === '...........##AA##BB##CC##DD#'
      : this.stateToString(state) === '...........##AAAA##BBBB##CCCC##DDDD#';
  }

  private getAdjacents(state: State) {
    // for each poppable item check if can move
    let adjs: State[] = [];
    adjs = [...adjs, ...this.getPoppingAmphipodsStates(state, 'aStack')];
    adjs = [...adjs, ...this.getPoppingAmphipodsStates(state, 'bStack')];
    adjs = [...adjs, ...this.getPoppingAmphipodsStates(state, 'cStack')];
    adjs = [...adjs, ...this.getPoppingAmphipodsStates(state, 'dStack')];

    for (let i = 0; i < state.hallway.length; i++) {
      if (state.hallway[i] !== '.') {
        // check fi this amphipod can go into its stack
        const destinationStack = this.findDestinationStack(state.hallway[i]);
        const hallwayToReach = state[destinationStack].getHallwayPosition();

        if (this.canReachStack(state, i, hallwayToReach)) {
          if (state[destinationStack].canPush(state.hallway[i])) {
            let steps = Math.abs(i - hallwayToReach);
            const newState = this.cloneState(state);
            const movingAmphipod = newState.hallway[i];
            newState.hallway[i] = '.';
            steps = steps + newState[destinationStack].add(movingAmphipod) + 1;
            newState.cost = steps * COSTS.get(movingAmphipod);
            adjs.push(newState);
          }
        }
      }
    }
    return adjs;
  }

  private canReachStack(state: State, i: number, destination: number) {
    const delta = i > destination ? -1 : +1;

    let currentPosition = i + delta;
    while (currentPosition !== destination) {
      if (state.hallway[currentPosition] !== '.') {
        return false;
      }
      currentPosition += delta;
    }
    return true;
  }

  private getPoppingAmphipodsStates(
    state: State,
    stackToCheck: 'aStack' | 'bStack' | 'cStack' | 'dStack'
  ) {
    const adjs: State[] = [];
    const stack = state[stackToCheck].clone();
    if (stack.canPop()) {
      // before popping check where, in the corridor can go
      const stackEntrance = stack.getHallwayPosition();

      // left
      const hallwayPositions = [];
      for (let i = stackEntrance; i >= 0; i--) {
        if (state.hallway[i] !== '.') {
          break;
        }
        if (HALLWAY_POSITIONS.includes(i)) {
          hallwayPositions.push(i);
        }
      }

      // right
      for (let i = stackEntrance; i < state.hallway.length; i++) {
        if (state.hallway[i] !== '.') {
          break;
        }
        if (HALLWAY_POSITIONS.includes(i)) {
          hallwayPositions.push(i);
        }
      }

      // foreach position compute adjd state and cost;
      for (const pos of hallwayPositions) {
        const newState = this.cloneState(state);
        const popped = newState[stackToCheck].pop();
        newState.hallway[pos] = popped.value;
        newState.cost =
          (popped.steps + 1 + Math.abs(stackEntrance - pos)) *
          COSTS.get(popped.value);
        adjs.push(newState);
      }
    }
    return adjs;
  }

  private cloneState(state: State) {
    return {
      hallway: state.hallway.slice(),
      aStack: state.aStack.clone(),
      bStack: state.bStack.clone(),
      cStack: state.cStack.clone(),
      dStack: state.dStack.clone(),
      cost: state.cost,
    };
  }

  private findDestinationStack(amphipod: string) {
    switch (amphipod) {
      case 'A':
        return 'aStack';
      case 'B':
        return 'bStack';
      case 'C':
        return 'cStack';
      case 'D':
        return 'dStack';
    }
  }

  private printState(state: State) {
    const printLine = (row: number) => {
      if (row >= state.aStack.getSize()) {
        return;
      }
      const line = `###${state.aStack.getValueAt(
        row
      )}#${state.bStack.getValueAt(row)}#${state.cStack.getValueAt(
        row
      )}#${state.dStack.getValueAt(row)}###`;
      console.log(line);
    };

    console.log();
    console.log('#############');
    let line = '#';
    for (const entry of Array.from(state.hallway.entries())) {
      line = `${line}${entry[1]}`;
    }
    console.log(`${line}#`);
    printLine(0);
    printLine(1);
    printLine(2);
    printLine(3);
    console.log('  #########  ');
    console.log();
  }

  public getFirstExpectedResult(): string {
    return '12521';
  }

  public solveSecond(): string {
    let splitInput = this.input.split('\n');
    splitInput = splitInput.slice(0, 3);
    splitInput.push('  #D#C#B#A#');
    splitInput.push('  #D#B#A#C#');
    splitInput.push(...this.input.split('\n').slice(3));

    return this.resolve(splitInput).toString();
  }

  public getSecondExpectedResult(): string {
    return '44169';
  }
}
