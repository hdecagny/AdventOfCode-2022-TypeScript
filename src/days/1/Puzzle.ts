import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private toIntArray(): number[] {
    return this.input.split('\n').map((n) => +n);
  }

  private countIncrements(depths: number[]) {
    let count = 0;
    for (const [index, value] of depths.slice().entries()) {
      if (value > depths[index - 1]) {
        count++;
      }
    }
    return count.toString();
  }

  public solveFirst(): string {
    const depths = this.toIntArray();
    return this.countIncrements(depths).toString();
  }

  public solveSecond(): string {
    const depths = this.toIntArray();
    const groups = Array.from(Array(depths.length - 2), (_, x) => x);
    const groupedDepths = [];
    for (const group of groups) {
      const subDepths = depths.slice(group, group + 3);
      const sum = subDepths.reduce((acc, next) => acc + next, 0);
      groupedDepths.push(sum);
    }
    return this.countIncrements(groupedDepths);
  }

  public getFirstExpectedResult(): string {
    return '7';
  }
  public getSecondExpectedResult(): string {
    return '5';
  }
}
