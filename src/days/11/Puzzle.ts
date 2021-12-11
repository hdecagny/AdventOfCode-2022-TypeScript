import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private displayWorld(world: number[][]) {
    for (const line of world) {
      console.log(line.join(''));
    }
    console.log();
  }

  private readonly NEIGHBOORHOOD = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, +1],
    [+1, -1],
    [+1, 0],
    [+1, +1],
  ];

  public solveFirst(): string {
    return this.evolve(100);
  }

  private evolve(stopAtStep = 0) {
    const world = this.input.split('\n').reduce((acc, next) => {
      acc.push(next.split('').map(Number));
      return acc;
    }, []);
    let gloomsCount = 0;
    let counter = 1;
    while (counter < Number.MAX_VALUE) {
      const gloomingTiles: number[][] = [];
      let gloomingAtThisStep = 0;
      for (let i = 0; i < world.length; i++) {
        for (let j = 0; j < world[i].length; j++) {
          world[i][j] += 1;
          if (world[i][j] === 10) {
            gloomsCount++;
            gloomingAtThisStep++;
            world[i][j] = 0;
            gloomingTiles.push([i, j]);
          }
        }
      }

      while (gloomingTiles.length > 0) {
        const [i, j] = gloomingTiles.shift();
        for (const [adjI, adjJ] of this.NEIGHBOORHOOD) {
          const newI = i + adjI;
          const newJ = j + adjJ;
          if (
            newI >= 0 &&
            newI < world.length &&
            newJ >= 0 &&
            newJ <= world[i].length
          ) {
            if (world[newI][newJ] > 0) {
              world[newI][newJ] += 1;
              if (world[newI][newJ] === 10) {
                gloomingAtThisStep++;
                gloomsCount++;
                world[newI][newJ] = 0;
                gloomingTiles.push([newI, newJ]);
              }
            }
          }
        }
      }
      if (gloomingAtThisStep === world.length * world[0].length) {
        return counter.toString();
      }
      if (stopAtStep && counter === stopAtStep) {
        return gloomsCount.toString();
      }

      counter++;
    }
    return '';
  }

  public getFirstExpectedResult(): string {
    return '1656';
  }

  public solveSecond(): string {
    return this.evolve();
  }

  public getSecondExpectedResult(): string {
    return '195';
  }
}
