import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private parseInput() {
    return this.input.split('\n').reduce((acc, next) => {
      acc.push(next);
      return acc;
    }, []);
  }

  public solveFirst(): string {
    const pairStrings = this.parseInput();
    let sum = '';
    for (const currentPairString of pairStrings) {
      const reduced = this.reduce(currentPairString);
      sum = this.add(sum, reduced);
      sum = this.reduce(sum);
    }

    return this.computeMagnitude(eval(sum)).toString();
  }

  private computeMagnitude(sum: [][]): number {
    if (typeof sum === 'number') {
      return sum;
    }

    if (typeof sum[0] === 'number' && typeof sum[1] === 'number') {
      return 3 * sum[0] + 2 * sum[1];
    }
    return (
      3 * this.computeMagnitude(sum[0]) + 2 * this.computeMagnitude(sum[1])
    );
  }

  private add(left: string, right: string): string {
    if (left === '') {
      return right;
    }
    return `[${left},${right}]`;
  }

  private reduce(pair: string): string {
    const exploded = this.explodePair(pair);

    if (exploded) {
      return this.reduce(exploded);
    }
    const splittableNumbers = pair
      .match(/\d+/g)
      .map(Number)
      .filter((n) => n >= 10);
    if (splittableNumbers.length > 0) {
      const toSplit = splittableNumbers[0];
      const left = Math.floor(toSplit / 2);
      const right = Math.ceil(toSplit / 2);
      const split = pair.replace(`${toSplit}`, `[${left},${right}]`);
      return this.reduce(split);
    }

    return pair;
  }

  private explodePair(pair: string): string {
    let openedSquareCount = 0;
    for (let i = 0; i < pair.length; i++) {
      const char = pair[i];
      if (char === '[') {
        openedSquareCount++;
      } else if (char === ']') {
        openedSquareCount--;
      } else if (char !== ',') {
        if (openedSquareCount === 5) {
          const startIndex = i - 1;
          const endIndex = i + pair.slice(i).indexOf(']');
          const explodingPair = `${pair.slice(i, endIndex)}`;
          const [leftNumber, rightNumber] = explodingPair
            .split(',')
            .map(Number);

          let left = pair.slice(0, startIndex);
          let right = pair.slice(endIndex + 1);
          const reversedLeft = left.split('').reverse().join('');
          let match = reversedLeft.match(/(\d+)/);
          if (match) {
            const newValue: number =
              +match[1].split('').reverse().join('') + leftNumber;
            left = reversedLeft
              .replace(
                match[1],
                `${newValue.toString().split('').reverse().join('')}`
              )
              .split('')
              .reverse()
              .join('');
          }

          match = right.match(/(\d+)/);
          if (match) {
            const newValue = +match[1] + rightNumber;
            right = right.replace(match[1], `${newValue}`);
          }

          return [left, right].join('0');
        }
      }
    }
    return undefined;
  }

  public getFirstExpectedResult(): string {
    return '4140';
  }

  public solveSecond(): string {
    const pairStrings = this.parseInput();
    let maxMagnitued = 0;
    for (let i = 0; i < pairStrings.length - 1; i++) {
      for (let j = i + 1; j < pairStrings.length; j++) {
        const a = pairStrings[i];
        const b = pairStrings[j];
        const reducedA = this.reduce(a);
        const reducedB = this.reduce(b);
        const firstSum = this.reduce(this.add(reducedA, reducedB));
        let magnitude = this.computeMagnitude(eval(firstSum));
        if (magnitude > maxMagnitued) {
          maxMagnitued = magnitude;
        }
        const secondSum = this.reduce(this.add(reducedB, reducedA));

        magnitude = this.computeMagnitude(eval(secondSum));
        if (magnitude > maxMagnitued) {
          maxMagnitued = magnitude;
        }
      }
    }

    return maxMagnitued.toString();
  }

  public getSecondExpectedResult(): string {
    return '3993';
  }
}
