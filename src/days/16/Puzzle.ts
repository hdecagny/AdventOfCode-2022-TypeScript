import Puzzle from '../../types/AbstractPuzzle';

type LiteralPacket = {
  version: number;
  type: number;
  digit: number;
  string: string;
};

type OperatorPacket = {
  version: number;
  type: number;
  string: string;
  children: Array<LiteralPacket | OperatorPacket>;
};

export default class ConcretePuzzle extends Puzzle {
  private readonly HEXMAP: { [key: string]: string } = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    A: '1010',
    B: '1011',
    C: '1100',
    D: '1101',
    E: '1110',
    F: '1111',
  };

  private buildPacket(binaryString: string): OperatorPacket | LiteralPacket {
    if (!binaryString) {
      return undefined;
    }

    const binaryVersion = binaryString.slice(0, 3);
    const version = parseInt(binaryVersion, 2);
    const binaryType = binaryString.slice(3, 6);
    const type = parseInt(binaryType, 2);

    if (type === 4) {
      const stringToExamine = binaryString.slice(6);
      let binaryDigit = '';
      let i = 0;
      let stringGroups = '';
      while (stringToExamine[i] !== '0') {
        const group = stringToExamine.slice(i, i + 5);
        stringGroups = `${stringGroups}${group}`;
        binaryDigit = `${binaryDigit}${group.slice(1)}`;
        i = i + 5;
      }
      const group = stringToExamine.slice(i, i + 5);
      stringGroups = `${stringGroups}${group}`;
      binaryDigit = `${binaryDigit}${group.slice(1)}`;

      return {
        version: version,
        type,
        digit: parseInt(binaryDigit, 2),
        string: `${binaryVersion}${binaryType}${stringGroups}`,
      };
    } else {
      const lengthTypeId = binaryString[6];

      let length = 15;
      if (lengthTypeId === '0') {
        length = 15;
      } else if (lengthTypeId === '1') {
        length = 11;
      }
      const binaryStringLength = binaryString.slice(7, 7 + length);
      const stringLength = parseInt(binaryStringLength, 2);
      const operator: OperatorPacket = {
        type,
        version,
        string: `${binaryVersion}${binaryType}${lengthTypeId}${binaryStringLength}`,
        children: [],
      };

      if (stringLength === 0) {
        return undefined;
      }

      let sub = binaryString.slice(operator.string.length);
      let count = 0;
      do {
        const newPacket = this.buildPacket(sub);
        if (!newPacket) {
          return operator;
        }
        count++;
        operator.children.push(newPacket);

        operator.string = `${operator.string}${newPacket.string}`;
        const split = binaryString.split(operator.string);

        sub = split ? split[1] : undefined;
      } while (
        (lengthTypeId === '0' && operator.string.length - 22 < stringLength) ||
        (lengthTypeId === '1' && count < stringLength)
      );
      return operator;
    }
  }

  private buildBinaryStrings() {
    return this.input.split('\n').map((binary) =>
      binary.split('').reduce((acc, next) => {
        acc = `${acc}${this.HEXMAP[next]}`;
        return acc;
      }, '')
    );
  }

  public solveFirst(): string {
    const inputStrings = this.buildBinaryStrings();
    const binaryString = inputStrings[0];
    const p = this.buildPacket(binaryString);
    return this.buildSum(p, 0).toString();
  }

  private buildSum(p: OperatorPacket | LiteralPacket, sum: number): number {
    if (p.type !== 4) {
      let newSum = sum + p.version;
      for (const child of (p as OperatorPacket).children) {
        newSum += this.buildSum(child, sum);
      }
      return newSum;
    } else {
      return sum + p.version;
    }
  }

  public getFirstExpectedResult(): string {
    return '14';
  }

  public solveSecond(): string {
    const inputStrings = this.buildBinaryStrings();
    const binaryString = inputStrings[0];
    const p = this.buildPacket(binaryString);
    return this.computeStringValues(p).toString();
  }

  private computeStringValues(packet: LiteralPacket | OperatorPacket): number {
    const { type } = packet;
    switch (type) {
      case 0:
        return this.doOp(packet, 0, '+');
      case 1:
        return this.doOp(packet, 1, '*');
      case 2:
        return this.find(packet, Number.MAX_SAFE_INTEGER, 'min');
      case 3:
        return this.find(packet, Number.MIN_SAFE_INTEGER, 'max');
      case 4:
        return (packet as LiteralPacket).digit;
      case 5:
        return this.compare(packet as OperatorPacket, '>');
      case 6:
        return this.compare(packet as OperatorPacket, '<');
      case 7:
        return this.compare(packet as OperatorPacket, '=');
    }
  }

  private compare(
    operator: OperatorPacket,
    operation: '>' | '<' | '='
  ): number {
    const first = operator.children[0] as LiteralPacket;
    const second = operator.children[1] as LiteralPacket;
    switch (operation) {
      case '>':
        return this.computeStringValues(first) >
          this.computeStringValues(second)
          ? 1
          : 0;
      case '<':
        return this.computeStringValues(first) <
          this.computeStringValues(second)
          ? 1
          : 0;
      case '=':
        return this.computeStringValues(first) ===
          this.computeStringValues(second)
          ? 1
          : 0;
    }
  }

  private doOp(
    p: LiteralPacket | OperatorPacket,
    acc: number,
    operation: '+' | '*'
  ) {
    let newAcc = acc;
    for (const child of (p as OperatorPacket).children) {
      newAcc =
        operation === '+'
          ? newAcc + this.computeStringValues(child)
          : newAcc * this.computeStringValues(child);
    }
    return newAcc;
  }

  private find(
    p: LiteralPacket | OperatorPacket,
    starting: number,
    operation: 'max' | 'min'
  ) {
    let newCurrent = starting;
    for (const child of (p as OperatorPacket).children) {
      const fromChild = this.computeStringValues(child);
      if (operation === 'max') {
        if (fromChild > newCurrent) {
          newCurrent = fromChild;
        }
      }
      if (operation === 'min') {
        if (fromChild < newCurrent) {
          newCurrent = fromChild;
        }
      }
    }
    return newCurrent;
  }

  public getSecondExpectedResult(): string {
    return '3';
  }
}
