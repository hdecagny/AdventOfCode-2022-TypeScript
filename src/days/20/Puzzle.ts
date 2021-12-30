import Puzzle from '../../types/AbstractPuzzle';

const ADJS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return this.iterate(2);
  }

  private iterate(times: number) {
    const [enhancementAlgorithm, image] = this.input.split('\n\n');
    let row = 0;
    let padding =
      enhancementAlgorithm[0] === '.'
        ? enhancementAlgorithm[0]
        : enhancementAlgorithm[511];
    let lineLength = 0;
    let pixelMap = image.split('\n').reduce((acc, next) => {
      const elements = next.split('');

      for (let j = -1; j <= elements.length; j++) {
        acc.set(`${row}%${j}`, elements[j] || padding);
      }

      row++;
      lineLength = elements.length;
      return acc;
    }, new Map<string, string>());

    for (const i of [-1, row]) {
      for (let j = -1; j <= lineLength; j++) {
        pixelMap.set(`${i}%${j}`, padding);
      }
    }
    let newMap = new Map<string, string>();
    let totalLitPixel = 0;
    for (let iteration = 1; iteration <= times; iteration++) {
      if (enhancementAlgorithm[0] === '#') {
        padding = padding === '.' ? '#' : '.';
      }

      let litPixels = 0;
      for (const key of Array.from(pixelMap.keys())) {
        const [i, j] = key.split('%').map(Number);
        const adjs: string[] = [];
        for (const [di, dj] of ADJS) {
          const adI = i + di;
          const adJ = j + dj;

          const existngAdj = pixelMap.get(`${adI}%${adJ}`);
          if (existngAdj) {
            adjs.push(existngAdj);
          } else {
            adjs.push(
              enhancementAlgorithm[0] === '#'
                ? padding === '.'
                  ? '#'
                  : '.'
                : '.'
            );
            newMap.set(`${adI}%${adJ}`, padding);
          }
        }

        const binary = adjs.map((v) => (v === '.' ? '0' : '1')).join('');
        const decimal = parseInt(binary, 2);
        const newValue = enhancementAlgorithm[decimal] as '#' | '.';

        if (newValue === '#') {
          litPixels++;
        }
        newMap.set(`${i}%${j}`, newValue);
      }

      pixelMap = newMap;
      newMap = new Map();
      totalLitPixel = litPixels;
    }

    return totalLitPixel.toString();
  }

  public getFirstExpectedResult(): string {
    return '35';
  }

  public solveSecond(): string {
    return this.iterate(50);
  }

  public getSecondExpectedResult(): string {
    return '3351';
  }
}
