import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private parseInput() {
    return this.input.split('\n');
  }

  getZeroesAndOnesCount(currentDigit: number, input: string[]) {
    let ones = 0;
    let zeroes = 0;
    for (const value of input) {
      value[currentDigit] === '1' ? ++ones : ++zeroes;
    }
    return { ones, zeroes };
  }

  public solveFirst(): string {
    const parsedInput = this.parseInput();
    const digits = Array.from(Array(parsedInput[0].length), (_, x) => x);
    const { gamma, epsilon } = digits.reduce(
      (total, digit) => {
        const { ones, zeroes } = this.getZeroesAndOnesCount(digit, parsedInput);
        if (ones >= zeroes) {
          return {
            gamma: `${total.gamma}1`,
            epsilon: `${total.epsilon}0`,
          };
        }
        return {
          gamma: `${total.gamma}0`,
          epsilon: `${total.epsilon}1`,
        };
      },
      {
        gamma: '',
        epsilon: '',
      }
    );
    return (parseInt(gamma, 2) * parseInt(epsilon, 2)).toString();
  }

  public getFirstExpectedResult(): string {
    return '198';
  }

  private computeMetric(parsedInput: string[], mostCommon: boolean) {
    const digits = Array.from(Array(parsedInput[0].length), (_, x) => x);
    let remainingNumbers = parsedInput.slice();
    for (const currentDigit of digits) {
      if (remainingNumbers.length === 1) {
        return remainingNumbers[0];
      }
      const { ones, zeroes } = this.getZeroesAndOnesCount(
        currentDigit,
        remainingNumbers
      );
      if (ones >= zeroes === mostCommon) {
        remainingNumbers = remainingNumbers.filter(
          (i) => i[currentDigit] === '1'
        );
      } else {
        remainingNumbers = remainingNumbers.filter(
          (i) => i[currentDigit] === '0'
        );
      }
    }
    return remainingNumbers[0];
  }

  public solveSecond(): string {
    const parsedInput = this.parseInput();
    const oxygen = this.computeMetric(parsedInput, true);
    const co2 = this.computeMetric(parsedInput, false);
    return (parseInt(oxygen, 2) * parseInt(co2, 2)).toString();
  }

  public getSecondExpectedResult(): string {
    return '230';
  }
}
