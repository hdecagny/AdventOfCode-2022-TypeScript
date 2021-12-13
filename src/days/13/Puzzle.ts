import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return this.fold(true).size.toString();
  }
  private fold(limitToOne = true) {
    const [lines, instructionsBlock] = this.input.split('\n\n');

    const pointsMap = lines.split('\n').reduce((acc, next) => {
      const [x, y] = next.split(',').map(Number);
      const item = `${x}-${y}`;
      acc.set(item, 1);
      return acc;
    }, new Map<string, number>());

    const instructions: [string, number][] = instructionsBlock
      .split('\n')
      .map((s) => {
        const match = s.match(/(y|x)=(\d+)/);
        return [match[1], +match[2]];
      });

    const limit = limitToOne ? 1 : 100;

    for (let i = 0; i < instructions.length && i < limit; i++) {
      const [instructionDirection, splitPoint] = instructions[i];
      let pointsToMove = [];
      if (instructionDirection === 'x') {
        pointsToMove = Array.from(pointsMap.entries()).filter(
          (p) => +p[0].split('-')[0] > splitPoint
        );
        for (const point of pointsToMove) {
          const pointKey = point[0];
          pointsMap.delete(pointKey);
          const [x, y] = pointKey.split('-').map(Number);
          const newX = splitPoint - (x - splitPoint);
          const newPoint = `${newX}-${y}`;
          if (!pointsMap.has(newPoint)) {
            pointsMap.set(newPoint, 1);
          }
        }
      } else {
        pointsToMove = Array.from(pointsMap.entries()).filter(
          (p) => +p[0].split('-')[1] > splitPoint
        );
        for (const point of pointsToMove) {
          const pointKey = point[0];
          pointsMap.delete(pointKey);
          const [x, y] = pointKey.split('-').map(Number);
          const newY = splitPoint - (y - splitPoint);
          const newPoint = `${x}-${newY}`;
          if (!pointsMap.has(newPoint)) {
            pointsMap.set(newPoint, 1);
          }
        }
      }
    }

    return pointsMap;
  }

  public getFirstExpectedResult(): string {
    return '17';
  }

  public solveSecond(): string {
    const map = this.fold(false);
    let maxX = 0;
    let maxY = 0;

    map.forEach((value, key) => {
      const [x, y] = key.split('-').map(Number);
      if (x > maxX) {
        maxX = x;
      }
      if (y > maxY) {
        maxY = y;
      }
    });
    const world = new Array(maxY + 1);
    for (let i = 0; i < world.length; i++) {
      world[i] = new Array(maxX + 1).fill('.');
    }

    for (const point of map) {
      const [x, y] = point[0].split('-').map(Number);
      world[y][x] = '#';
    }
    for (let i = 0; i < world.length; i++) {
      console.log(
        world[i].map((c: string) => (c === '.' ? ' ' : '#')).join('')
      );
    }
    return '';
  }

  public getSecondExpectedResult(): string {
    return '';
  }
}
