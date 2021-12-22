import Puzzle from '../../types/AbstractPuzzle';

const ROTATION_MATRIXES = [
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, -1, 0, 1, 0],
  [1, 0, 0, 0, -1, 0, 0, 0, -1],
  [1, 0, 0, 0, 0, 1, 0, -1, 0],
  [0, -1, 0, 1, 0, 0, 0, 0, 1],
  [0, 0, 1, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 0, 0, 0, -1],
  [0, 0, -1, 1, 0, 0, 0, -1, 0],
  [-1, 0, 0, 0, -1, 0, 0, 0, 1],
  [-1, 0, 0, 0, 0, -1, 0, -1, 0],
  [-1, 0, 0, 0, 1, 0, 0, 0, -1],
  [-1, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, -1, 0, 0, 0, 0, 1],
  [0, 0, 1, -1, 0, 0, 0, -1, 0],
  [0, -1, 0, -1, 0, 0, 0, 0, -1],
  [0, 0, -1, -1, 0, 0, 0, 1, 0],
  [0, 0, -1, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 1, 0, -1, 0, 1, 0, 0],
  [0, -1, 0, 0, 0, -1, 1, 0, 0],
  [0, 0, -1, 0, -1, 0, -1, 0, 0],
  [0, -1, 0, 0, 0, 1, -1, 0, 0],
  [0, 0, 1, 0, 1, 0, -1, 0, 0],
  [0, 1, 0, 0, 0, -1, -1, 0, 0],
];

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return this.findSensorsAndBeacons().beaconsCount.toString();
  }

  private findSensorsAndBeacons() {
    const scanners = [];
    const scannerBlocks = this.input.split('\n\n');
    for (let i = 0; i < scannerBlocks.length; i++) {
      const currentScanner = scannerBlocks[i].split('\n').slice(1);
      const beacons: number[][] = [];
      for (const sensor of currentScanner) {
        const [x, y, z] = sensor.split(',').map(Number);
        beacons.push([x, y, z]);
      }
      scanners.push(beacons);
    }

    const beaconsMap = new Map<string, number[]>();
    for (const beacon of scanners[0]) {
      beaconsMap.set(beacon.join(','), beacon);
    }
    const scannersToSolve = scanners.slice(1);
    const sensors = [];

    while (scannersToSolve.length > 0) {
      const toSolve = scannersToSolve[0];
      const rotationSets = [];
      for (const rotation of ROTATION_MATRIXES) {
        const newSet = [];
        for (const beacon of toSolve) {
          newSet.push(this.multiplyMatrixAndPoint(rotation, beacon));
        }
        rotationSets.push(newSet);
      }
      let foundOverlapping = false;
      for (const currentRotation of rotationSets) {
        const overlapping = this.findOverlapping(beaconsMap, currentRotation);
        if (overlapping) {
          const [x, y, z] = overlapping.sensor;
          sensors.push([-x, -y, -z]);

          for (const beacon of currentRotation) {
            const [sx, sy, sz] = beacon;
            const translated = [sx - x, sy - y, sz - z];
            const key = translated.join(',');
            if (!beaconsMap.has(key)) {
              beaconsMap.set(key, translated);
            }
          }

          foundOverlapping = true;
          break;
        }
      }
      if (foundOverlapping) {
        scannersToSolve.shift();
      } else {
        const first = scannersToSolve.shift();
        scannersToSolve.push(first);
      }
    }

    return { beaconsCount: beaconsMap.size.toString(), sensors };
  }

  private findOverlapping(
    knownBeacons: Map<string, number[]>,
    toSolve: number[][]
  ) {
    // try moving everyPoint of toSolve to a point of scanner and count equals
    for (const solvedBeacon of knownBeacons) {
      const [dx, dy, dz] = solvedBeacon[1];
      for (const beaconToSolve of toSolve) {
        const [sx, sy, sz] = beaconToSolve;
        const xOffset = sx - dx;
        const yOffset = sy - dy;
        const zOffset = sz - dz;
        const translatedSet = toSolve.map(([x, y, z]) => [
          x - xOffset,
          y - yOffset,
          z - zOffset,
        ]);

        let equalsCount = 0;
        for (const t of translatedSet) {
          if (knownBeacons.has(t.join(','))) {
            equalsCount++;
          }
        }
        if (equalsCount >= 12) {
          return {
            sensor: [xOffset, yOffset, zOffset],
          };
        }
      }
    }
    return null;
  }

  private manhattanDistance(a: number[], b: number[]) {
    return (
      Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
    );
  }

  public getFirstExpectedResult(): string {
    return '79';
  }

  public solveSecond(): string {
    const { sensors } = this.findSensorsAndBeacons();
    let max = 0;
    for (let i = 0; i < sensors.length - 2; i++) {
      for (let j = i + 1; j < sensors.length; j++) {
        const distance = this.manhattanDistance(sensors[i], sensors[j]);
        if (distance >= max) {
          max = distance;
        }
      }
    }

    return max.toString();
  }

  public getSecondExpectedResult(): string {
    return '3621';
  }

  private multiplyMatrixAndPoint(matrix: number[], point: number[]) {
    // Give a simple variable name to each part of the matrix, a column and row number
    const c0r0 = matrix[0],
      c1r0 = matrix[1],
      c2r0 = matrix[2];
    const c0r1 = matrix[3],
      c1r1 = matrix[4],
      c2r1 = matrix[5];
    const c0r2 = matrix[6],
      c1r2 = matrix[7],
      c2r2 = matrix[8];

    // Now set some simple names for the point
    const x = point[0];
    const y = point[1];
    const z = point[2];

    // Multiply the point against each part of the 1st column, then add together
    const resultX = x * c0r0 + y * c0r1 + z * c0r2;

    // Multiply the point against each part of the 2nd column, then add together
    const resultY = x * c1r0 + y * c1r1 + z * c1r2;

    // Multiply the point against each part of the 3rd column, then add together
    const resultZ = x * c2r0 + y * c2r1 + z * c2r2;

    return [resultX, resultY, resultZ];
  }
}
