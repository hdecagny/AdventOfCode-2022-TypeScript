import Puzzle from '../../types/AbstractPuzzle';

type Mapping = {
  [key: string]: number;
};

export default class ConcretePuzzle extends Puzzle {
  private parseInput(): { wires: string[][]; digits: string[][] }[] {
    return this.input.split('\n').reduce((acc, next) => {
      const [wires, digits] = next.split(' | ');
      acc.push({
        wires: wires.split(' ').map((w) => w.split('')),
        digits: digits.split(' ').map((w) => w.split('')),
      });
      return acc;
    }, []);
  }

  public solveFirst(): string {
    const input = this.parseInput();
    let count = 0;
    for (const currentLine of input) {
      const { digits } = currentLine;
      for (const currentDigit of digits) {
        if ([2, 3, 4, 7].includes(currentDigit.length)) {
          count++;
        }
      }
    }
    return count.toString();
  }

  public getFirstExpectedResult(): string {
    return '26';
  }

  public solveSecond(): string {
    const input = this.parseInput();
    let sum = 0;
    for (const currentLine of input) {
      const mapping: Mapping = {};
      const { wires } = currentLine;
      const lengthSorted = wires.sort((a, b) => a.length - b.length);
      const one = lengthSorted[0];
      const seven = lengthSorted[1];
      const four = lengthSorted[2];
      const eigth = lengthSorted[9];

      mapping[this.sortStringArray(one)] = 1;
      mapping[this.sortStringArray(seven)] = 7;
      mapping[this.sortStringArray(four)] = 4;
      mapping[this.sortStringArray(eigth)] = 8;

      // 2/3/5
      let length5 = wires.filter((w) => w.length === 5);

      // 3 includes 7
      const threeIndex = length5.findIndex((w) =>
        this.includesSparse(w, seven)
      );
      const three = length5[threeIndex];
      mapping[this.sortStringArray(three)] = 3;
      length5 = length5
        .slice(0, threeIndex)
        .concat(length5.slice(threeIndex + 1, length5.length));

      let length9 = wires.filter((w) => w.length === 6);
      // 9 includes 4
      const nineIndex = length9.findIndex((w) => this.includesSparse(w, four));
      mapping[this.sortStringArray(length9[nineIndex])] = 9;
      // console.log(nine, 'is 9');
      length9 = length9
        .slice(0, nineIndex)
        .concat(length9.slice(nineIndex + 1, length9.length));
      // 0 includes 7
      const zeroIndex = length9.findIndex((w) => this.includesSparse(w, seven));
      mapping[this.sortStringArray(length9[zeroIndex])] = 0;

      const six = length9
        .slice(0, zeroIndex)
        .concat(length9.slice(zeroIndex + 1, length9.length))[0];
      mapping[this.sortStringArray(six)] = 6;
      const fiveIndex = length5.findIndex((w) => this.includesSparse(six, w));
      mapping[this.sortStringArray(length5[fiveIndex])] = 5;

      const two = length5
        .slice(0, fiveIndex)
        .concat(length5.slice(fiveIndex + 1, length5.length))[0];
      mapping[this.sortStringArray(two)] = 2;

      const { digits } = currentLine;
      const summed = parseInt(
        digits.reduce(
          (acc, next) => `${acc}${mapping[this.sortStringArray(next)]}`,
          ''
        )
      );
      sum += summed;
    }
    return sum.toString();
  }

  private includesSparse(theString: string[], chars: string[]) {
    let count = 0;
    for (const char of chars) {
      if (theString.includes(char)) {
        count++;
      }
    }
    return count === chars.length;
  }

  private sortStringArray(theString: string[]) {
    return theString.sort((a, b) => (a > b ? 1 : -1)).join('');
  }

  public getSecondExpectedResult(): string {
    return '61229';
  }
}
