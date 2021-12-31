import Puzzle from '../../types/AbstractPuzzle';

type Cuboid = {
  x: number[];
  y: number[];
  z: number[];
  op: number;
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return this.countLit(true);
  }

  private countLit(shortRange: boolean) {
    const cuboids: Cuboid[] = this.input.split('\n').reduce((acc, next) => {
      const [operation, coords] = next.split(' ');
      const [x, y, z] = coords
        .match(/x=(-*\d+..-*\d+),y=(-*\d+..-*\d+),z=(-*\d+..-*\d+)/)
        .slice(1);
      acc.push({
        op: operation === 'on' ? 1 : 0,
        x: x.split('..').map(Number),
        y: y.split('..').map(Number),
        z: z.split('..').map(Number),
      });
      return acc;
    }, new Array<Cuboid>());

    const visited: Cuboid[] = [];

    for (const cuboid of cuboids) {
      if (shortRange) {
        if (cuboid.x[0] < -50 || cuboid.x[1] > 50) {
          continue;
        }
        if (cuboid.y[0] < -50 || cuboid.y[1] > 50) {
          continue;
        }
        if (cuboid.z[0] < -50 || cuboid.z[1] > 50) {
          continue;
        }
      }
      const newCuboids: Cuboid[] = [];
      if (cuboid.op === 1) {
        newCuboids.push(cuboid);
      }

      for (const visitedCuboid of visited) {
        const intersectionCuboid = this.buildIntersectionCuboid(
          visitedCuboid,
          cuboid,
          -visitedCuboid.op
        );
        if (intersectionCuboid) {
          newCuboids.push(intersectionCuboid);
        }
      }
      visited.push(...newCuboids);
    }

    return visited
      .reduce((acc, next) => acc + next.op * this.computeCuboidSize(next), 0)
      .toString();
  }

  private computeCuboidSize(cuboid: Cuboid) {
    return (
      (cuboid.x[1] - cuboid.x[0] + 1) *
      (cuboid.y[1] - cuboid.y[0] + 1) *
      (cuboid.z[1] - cuboid.z[0] + 1)
    );
  }
  private buildIntersectionCuboid(a: Cuboid, b: Cuboid, on: number) {
    const xx = this.intersectingAxis(a.x, b.x);
    const yy = this.intersectingAxis(a.y, b.y);
    const zz = this.intersectingAxis(a.z, b.z);
    if (xx && yy && zz) {
      return {
        op: on,
        x: xx,
        y: yy,
        z: zz,
      } as Cuboid;
    }
    return undefined;
  }

  private intersectingAxis(a: number[], b: number[]) {
    const left = Math.max(a[0], b[0]);
    const right = Math.min(a[1], b[1]);
    return left <= right ? [left, right] : undefined;
  }

  public getFirstExpectedResult(): string {
    return '474140';
  }

  public solveSecond(): string {
    return this.countLit(false);
  }

  public getSecondExpectedResult(): string {
    return '2758514936282235';
  }
}
