import Puzzle from '../../types/AbstractPuzzle';

type Coord = { x1: number; x2: number; y1: number; y2: number };

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const coords = this.parseInput();
    const horizontalOrVerticalOnly = coords.filter(
      (p) => p.x1 === p.x2 || p.y1 === p.y2
    );
    return this.computePoints(horizontalOrVerticalOnly);
  }

  private parseInput(): Coord[] {
    const lines = this.input.split('\n');
    return lines.reduce((acc, next) => {
      const [_, x1, y1, x2, y2] = next.match(/(\d+),(\d+) -> (\d+),(\d+)/);
      const newItem = {
        x1: +x1,
        y1: +y1,
        x2: +x2,
        y2: +y2,
      };
      acc.push(newItem);
      return acc;
    }, []);
  }

  private computePoints(
    coords: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }[]
  ) {
    const pointsMap = new Map<string, number>();
    for (const point of coords) {
      const a = { x: point.x1, y: point.y1 };
      const b = { x: point.x2, y: point.y2 };
      if (a.x !== b.x && a.y == b.y) {
        let x = a.x > b.x ? b.x : a.x;
        const endX = a.x > b.x ? a.x : b.x;

        for (; x <= endX; x++) {
          this.addToPointsMap(pointsMap, x, a.y);
        }
      } else if (a.y !== b.y && a.x === b.x) {
        let y = a.y > b.y ? b.y : a.y;
        const endY = a.y > b.y ? a.y : b.y;
        for (; y <= endY; y++) {
          this.addToPointsMap(pointsMap, a.x, y);
        }
      } else if (a.y !== b.y && a.x !== b.x) {
        let x = a.x;
        const endX = b.x;
        let y = a.y;
        const endY = b.y;
        const xIncrement = a.x > b.x ? -1 : 1;
        const yIncrement = a.y > b.y ? -1 : 1;

        while (x !== endX && y !== endY) {
          this.addToPointsMap(pointsMap, x, y);
          x += xIncrement;
          y += yIncrement;
        }
        this.addToPointsMap(pointsMap, endX, endY);
      }
    }

    return Array.from(pointsMap.entries())
      .filter(([_, value]) => value >= 2)
      .length.toString();
  }

  private addToPointsMap(pointsMap: Map<string, number>, x: number, y: number) {
    const occurences = pointsMap.get(`${x}-${y}`);
    if (occurences) {
      pointsMap.set(`${x}-${y}`, occurences + 1);
    } else {
      pointsMap.set(`${x}-${y}`, 1);
    }
  }

  public getFirstExpectedResult(): string {
    return '5';
  }

  public solveSecond(): string {
    const coords = this.parseInput();
    return this.computePoints(coords);
  }

  public getSecondExpectedResult(): string {
    return '12';
  }
}
