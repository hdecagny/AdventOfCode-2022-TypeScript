import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return this.findMaxAndCount().maxY.toString();
  }

  private findMaxAndCount() {
    const [x, y] = this.input
      .split('\n')[0]
      .split('target area: ')[1]
      .split(', ')
      .map((xString) =>
        xString.split('=').reduce(
          (acc, next) => {
            const [start, end] = next.split('..').map(Number);
            acc.start = start;
            acc.end = end;
            return acc;
          },
          { start: 0, end: 0 }
        )
      );

    let maxY = 0;
    const probePosition = { x: 0, y: 0 };
    let count = 0;
    for (let i = 0; i < 500; i++) {
      for (let j = -500; j < 500; j++) {
        let deltaX = i;
        let deltaY = j;
        let localMaxY = 0;
        const current = { ...probePosition };
        let over = false;
        while (!over) {
          current.x = current.x + deltaX;
          current.y = current.y + deltaY;

          if (
            current.x >= x.start &&
            current.x <= x.end &&
            current.y >= y.start &&
            current.y <= y.end
          ) {
            count++;
            if (localMaxY > maxY) {
              maxY = localMaxY;
            }
            over = true;
          } else if (current.x > x.end || current.y < y.start) {
            over = true;
          }

          if (current.y > localMaxY) {
            localMaxY = current.y;
          }

          if (deltaX > 0) {
            deltaX--;
          } else if (deltaX < 0) {
            deltaX++;
          }
          deltaY--;
        }
      }
    }
    return { maxY, count };
  }

  public getFirstExpectedResult(): string {
    return '45';
  }

  public solveSecond(): string {
    return this.findMaxAndCount().count.toString();
  }

  public getSecondExpectedResult(): string {
    return '112';
  }
}
