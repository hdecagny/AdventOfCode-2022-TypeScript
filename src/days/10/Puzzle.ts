import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private getCorruptedScoreAndGoodLines() {
    const parsedInput = this.input.split('\n');

    const pointsMap: { [key: string]: number } = {
      ')': 3,
      ']': 57,
      '}': 1197,
      '>': 25137,
    };

    let score = 0;
    const goodLines = [];
    for (const currentLine of parsedInput) {
      const stack = [];
      let goodLine = true;
      for (let i = 0; i < currentLine.length && goodLine; i++) {
        const char = currentLine[i];
        if (this.OPENERS.includes(char)) {
          stack.push(char);
        } else {
          const current = stack.pop();
          const expected = this.LANG[current];
          if (char !== expected) {
            score += pointsMap[char];
            goodLine = false;
          }
        }
      }
      if (goodLine) {
        goodLines.push(currentLine);
      }
    }

    return {
      score,
      goodLines,
    };
  }

  private readonly OPENERS = ['(', '[', '{', '<'];
  private readonly LANG: { [key: string]: string } = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
  };

  public solveFirst(): string {
    return this.getCorruptedScoreAndGoodLines().score.toString();
  }

  public getFirstExpectedResult(): string {
    return '26397';
  }

  public solveSecond(): string {
    const { goodLines } = this.getCorruptedScoreAndGoodLines();

    const pointsMap: { [key: string]: number } = {
      ')': 1,
      ']': 2,
      '}': 3,
      '>': 4,
    };
    const scores: number[] = [];
    for (const currentLine of goodLines) {
      const stack = [];
      for (const currentChar of currentLine) {
        if (this.OPENERS.includes(currentChar)) {
          stack.push(currentChar);
        } else {
          stack.pop();
        }
      }
      let score = 0;
      for (const currentChar of stack.reverse()) {
        score = score * 5 + pointsMap[this.LANG[currentChar]];
      }
      const biggerScoreIndex = scores.findIndex((s) => s > score);
      if (biggerScoreIndex !== -1) {
        scores.splice(biggerScoreIndex, 0, score);
      } else {
        scores.push(score);
      }
    }

    return scores[(scores.length - 1) / 2].toString();
  }

  public getSecondExpectedResult(): string {
    return '288957';
  }
}
