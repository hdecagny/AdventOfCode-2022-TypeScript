import Puzzle from '../../types/AbstractPuzzle';
const frequencies: number[] = [];
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    for (let k = 1; k <= 3; k++) {
      frequencies[i + j + k] = (frequencies[i + j + k] ?? 0) + 1;
    }
  }
}
export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    let [p1Position, p2Position] = this.input
      .split('\n')
      .map((l) => +l.split(': ')[1]);

    p1Position = p1Position - 1;
    p2Position = p2Position - 1;

    return this.playGame(p1Position, p2Position);
  }

  private playGame(p1Position: number, p2Position: number) {
    let p1Score = 0;
    let p2Score = 0;
    let rollingDiceValue = 0;
    let rollCount = 0;
    const winner = false;
    while (!winner) {
      const p1 = this.roll(p1Position, p1Score, [
        ++rollingDiceValue,
        ++rollingDiceValue,
        ++rollingDiceValue,
      ]);
      rollCount += 3;
      p1Position = p1.pPosition;
      p1Score = p1.pScore;

      if (p1Score >= 1000) {
        return (p2Score * rollCount).toString();
      }

      const p2 = this.roll(p2Position, p2Score, [
        ++rollingDiceValue,
        ++rollingDiceValue,
        ++rollingDiceValue,
      ]);
      rollCount += 3;
      p2Position = p2.pPosition;
      p2Score = p2.pScore;
      if (p2Score >= 1000) {
        return (p1Score * rollCount).toString();
      }
    }
  }

  private countWins(
    p1Position: number,
    p2Position: number,
    p1Score: number,
    p2Score: number,
    cache = new Map<string, number[]>()
  ) {
    if (p1Score >= 21) {
      return [1, 0];
    }
    if (p2Score >= 21) {
      return [0, 1];
    }

    const fromCache = cache.get(
      [p1Position, p2Position, p1Score, p2Score].join(';')
    );
    if (fromCache) {
      return fromCache;
    }
    const scores = [0, 0];
    for (const i of [1, 2, 3]) {
      for (const j of [1, 2, 3]) {
        for (const k of [1, 2, 3]) {
          const p1 = this.roll(p1Position, p1Score, [i, j, k]);

          const [x1, y1] = this.countWins(
            p2Position,
            p1.pPosition,
            p2Score,
            p1.pScore,
            cache
          );
          scores[0] += y1;
          scores[1] += x1;
        }
      }
    }

    cache.set([p1Position, p2Position, p1Score, p2Score].join(';'), scores);
    return scores;
  }

  private roll(pPosition: number, pScore: number, values: number[]) {
    const pDelta = values.reduce((acc, next) => acc + next, 0);
    pPosition = (pPosition + pDelta) % 10;
    pScore += pPosition + 1;
    return { pPosition, pScore };
  }

  public getFirstExpectedResult(): string {
    return '739785';
  }

  public solveSecond(): string {
    let [p1Position, p2Position] = this.input
      .split('\n')
      .map((l) => +l.split(': ')[1]);

    p1Position = p1Position - 1;
    p2Position = p2Position - 1;
    const res = this.countWins(p1Position, p2Position, 0, 0);

    return Math.max(...res).toString();
  }

  public getSecondExpectedResult(): string {
    return '444356092776315';
  }
}
