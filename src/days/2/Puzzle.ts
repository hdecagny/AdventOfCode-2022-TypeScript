import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private getInstructions(): { direction: string; value: number }[] {
    return this.input.split('\n').reduce((acc, next) => {
      const [direction, value] = next.split(' ');
      acc.push({ direction, value: +value });
      return acc;
    }, []);
  }

  readonly FORWARD = 'forward';
  readonly UP = 'up';
  readonly DOWN = 'down';

  public solveFirst(): string {
    const instructions = this.getInstructions();
    let hPosition = 0;
    let vPosition = 0;
    for (const currentInstruction of instructions) {
      switch (currentInstruction.direction) {
        case this.FORWARD:
          hPosition += currentInstruction.value;
          break;
        case this.UP:
          vPosition -= currentInstruction.value;
          break;
        case this.DOWN:
          vPosition += currentInstruction.value;
          break;
      }
    }
    return (hPosition * vPosition).toString();
  }

  public getFirstExpectedResult(): string {
    return '150';
  }

  public solveSecond(): string {
    const instructions = this.getInstructions();
    let hPosition = 0;
    let vPosition = 0;
    let aim = 0;
    for (const currentInstruction of instructions) {
      switch (currentInstruction.direction) {
        case this.FORWARD:
          hPosition += currentInstruction.value;
          vPosition += aim * currentInstruction.value;
          break;
        case this.UP:
          aim -= currentInstruction.value;
          break;
        case this.DOWN:
          aim += currentInstruction.value;
          break;
      }
    }
    return (hPosition * vPosition).toString();
  }

  public getSecondExpectedResult(): string {
    return '900';
  }
}
