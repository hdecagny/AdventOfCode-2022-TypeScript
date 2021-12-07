import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private parseInput() {
    return this.input.split(',').map(Number);
  }

  public solveFirst(): string {
    const numbers = this.parseInput().sort((a, b) => a - b);
    const mean = numbers[numbers.length / 2];
    return numbers
      .reduce((acc, next) => {
        acc += Math.abs(next - mean);
        return acc;
      }, 0)
      .toString();
  }

  public getFirstExpectedResult(): string {
    return '37';
  }

  public solveSecond(): string {
    let max = 0;
    const numbers = this.input.split(',').map((a) => {
      if (+a > max) {
        max = +a;
      }
      return +a;
    });
    let min = Number.MAX_VALUE;
    for (let currentPosition = 0; currentPosition < max; currentPosition++) {
      let costSum = 0;

      for (const currentNumber of numbers) {
        const delta = Math.abs(currentPosition - currentNumber);
        costSum += (delta * (delta + 1)) / 2;
      }
      if (costSum < min) {
        min = costSum;
      } else {
        break;
      }
    }

    return min.toString();
  }

  public getSecondExpectedResult(): string {
    return '168';
  }
}
