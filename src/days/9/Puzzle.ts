import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private computeLowestPointSum(): string {
    const world = this.buildWorld();
    let lowestPointsSum = 0;
    for (let i = 0; i < world.length; i++) {
      for (let j = 0; j < world[i].length; j++) {
        const currentValue = world[i][j];
        // up
        if (i - 1 >= 0 && currentValue >= world[i - 1][j]) {
          continue;
        }

        // down
        if (i + 1 < world.length && currentValue >= world[i + 1][j]) {
          continue;
        }

        // left
        if (j - 1 >= 0 && currentValue >= world[i][j - 1]) {
          continue;
        }

        // right
        if (j + 1 < world[i].length && currentValue >= world[i][j + 1]) {
          continue;
        }
        lowestPointsSum += currentValue + 1;
      }
    }
    return lowestPointsSum.toString();
  }

  private computeBiggestBasins(): string {
    const world = this.buildWorld();
    const biggestBasins = new Array(3).fill(0);
    for (let i = 0; i < world.length; i++) {
      for (let j = 0; j < world[i].length; j++) {
        const currentValue = world[i][j];
        // it can be a low points, start computing basin directions
        const nextPoints = [];
        // up
        if (i - 1 >= 0) {
          if (currentValue >= world[i - 1][j]) {
            continue;
          }
          // can go up so add to basin
          if (world[i - 1][j] < 9) {
            nextPoints.push([i - 1, j]);
          }
        }

        // down
        if (i + 1 < world.length) {
          if (currentValue >= world[i + 1][j]) {
            continue;
          }
          // can go down so add to basin
          if (world[i + 1][j] < 9) {
            nextPoints.push([i + 1, j]);
          }
        }

        // left
        if (j - 1 >= 0) {
          if (currentValue >= world[i][j - 1]) {
            continue;
          }
          // can go left so add to basin
          if (world[i][j - 1] < 9) {
            nextPoints.push([i, j - 1]);
          }
        }

        // right
        if (j + 1 < world[i].length) {
          if (currentValue >= world[i][j + 1]) {
            continue;
          }
          // can go right so add to basin
          if (world[i][j + 1] < 9) {
            nextPoints.push([i, j + 1]);
          }
        }
        let basinSize = 1;
        const visited = [];
        while (nextPoints.length > 0) {
          const currentPoint = nextPoints.pop();
          if (
            visited.findIndex(
              ([pi, pj]) => pi === currentPoint[0] && pj === currentPoint[1]
            ) !== -1
          ) {
            continue;
          }
          visited.push(currentPoint);
          basinSize++;
          const biggerAjdjacents = this.findBiggerAdjacents(
            world,
            currentPoint
          );
          nextPoints.push(...biggerAjdjacents);
        }

        const minValue = Math.min(...biggestBasins);
        if (basinSize > minValue) {
          const minIndex = biggestBasins.findIndex((v) => v === minValue);
          biggestBasins[minIndex] = basinSize;
        }
      }
    }
    return biggestBasins.reduce((acc, next) => acc * next).toString();
  }

  private buildWorld() {
    return this.input.split('\n').reduce((acc, next) => {
      acc.push(next.split('').map(Number));
      return acc;
    }, []);
  }

  public solveFirst(): string {
    return this.computeLowestPointSum();
  }

  private findBiggerAdjacents(world: number[][], currentPoint: number[]) {
    const [i, j] = currentPoint;
    const currentValue = world[i][j];
    const biggerAjdjacents: number[][] = [];
    // up
    if (i - 1 >= 0) {
      // can go up so add to basin
      if (world[i - 1][j] > currentValue && world[i - 1][j] < 9) {
        biggerAjdjacents.push([i - 1, j]);
      }
    }

    // down
    if (i + 1 < world.length) {
      // can go down so add to basin
      if (world[i + 1][j] > currentValue && world[i + 1][j] < 9) {
        biggerAjdjacents.push([i + 1, j]);
      }
    }

    // left
    if (j - 1 >= 0) {
      // can go left so add to basin
      if (world[i][j - 1] > currentValue && world[i][j - 1] < 9) {
        biggerAjdjacents.push([i, j - 1]);
      }
    }

    // right
    if (j + 1 < world[i].length) {
      // can go right so add to basin
      if (world[i][j + 1] > currentValue && world[i][j + 1] < 9) {
        biggerAjdjacents.push([i, j + 1]);
      }
    }

    return biggerAjdjacents;
  }

  public getFirstExpectedResult(): string {
    return '15';
  }

  public solveSecond(): string {
    return this.computeBiggestBasins();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '1134';
  }
}
