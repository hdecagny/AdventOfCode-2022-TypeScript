import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private runSimulation(iterations: number) {
    const numbers = this.input.split(',').map(Number);
    const ages = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (const number of numbers) {
      ages[number]++;
    }
    for (let i = 0; i < iterations; i++) {
      ages[7] += ages[0];
      const newBreed = ages.shift();
      ages.push(newBreed);
    }

    const sum = ages.reduce((acc, next) => acc + next, 0);
    return sum.toString();
  }

  public solveFirst(): string {
    return this.runSimulation(80);
  }

  public getFirstExpectedResult(): string {
    return '5934';
  }

  public solveSecond(): string {
    return this.runSimulation(256);
  }

  public getSecondExpectedResult(): string {
    return '26984457539';
  }
}
