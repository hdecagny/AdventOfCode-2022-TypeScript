import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private runSimulation(steps: number) {
    const countMap = new Map<string, number>();
    const [templateString, rulesBlock] = this.input.split('\n\n');
    const rules = rulesBlock.split('\n').reduce((acc, next) => {
      const [head, value] = next.split(' -> ');
      acc.set(head, value);
      if (!countMap.has(value)) {
        countMap.set(value, 0);
      }
      return acc;
    }, new Map<string, string>());
    for (const char of templateString) {
      const count = countMap.get(char);
      countMap.set(char, count + 1);
    }
    const pairs = new Map<string, number>();

    for (let i = 0; i < templateString.length - 1; i++) {
      pairs.set(`${templateString[i]}${templateString[i + 1]}`, 1);
    }

    let stepCounter = 0;
    while (stepCounter < steps) {
      const currentPairs = Array.from(pairs.entries());

      for (const [pair, pairCount] of currentPairs) {
        const newChar = rules.get(pair);

        const count = countMap.get(newChar);
        countMap.set(newChar, count + pairCount);

        pairs.set(pair, pairs.get(pair) - pairCount);

        this.addOrIncrement(pairs, `${pair[0]}${newChar}`, pairCount);
        this.addOrIncrement(pairs, `${newChar}${pair[1]}`, pairCount);
      }

      stepCounter++;
    }
    const max = Math.max(...Array.from(countMap.values()));
    const min = Math.min(...Array.from(countMap.values()));
    return (max - min).toString();
  }

  public solveFirst(): string {
    return this.runSimulation(10);
  }

  private addOrIncrement(
    map: Map<string, number>,
    key: string,
    amount: number
  ) {
    const value = map.get(key);
    if (value) {
      map.set(key, value + amount);
    } else {
      map.set(key, amount);
    }
  }

  public getFirstExpectedResult(): string {
    return '1588';
  }

  public solveSecond(): string {
    return this.runSimulation(40);
  }

  public getSecondExpectedResult(): string {
    return '2188189693529';
  }
}
