import Puzzle from '../../types/AbstractPuzzle';

type Board = {
  numbers: Map<number, { row: number; col: number }>;
  marked: number[];
  markedRows: { [key: number]: number };
  markedCols: { [key: number]: number };
  won: boolean;
};

export default class ConcretePuzzle extends Puzzle {
  private computeWinningScores(numbersToDraw: number[], boards: Board[]) {
    let firstWinnerScore;
    let lastWinnerScore;
    let winnersCount = 0;
    let drawnNumbersCount = 0;
    for (const drawnNumber of numbersToDraw) {
      drawnNumbersCount++;
      for (let i = 0; i < boards.length; i++) {
        const board = boards[i];
        const drawnNumberPositionOnBoard = board.numbers.get(drawnNumber);
        if (drawnNumberPositionOnBoard) {
          board.marked.push(drawnNumber);
          board.markedRows[drawnNumberPositionOnBoard.row]++;
          board.markedCols[drawnNumberPositionOnBoard.col]++;
          if (
            drawnNumbersCount >= 5 &&
            (board.markedRows[drawnNumberPositionOnBoard.row] >= 5 ||
              board.markedCols[drawnNumberPositionOnBoard.col] >= 5)
          ) {
            if (!firstWinnerScore) {
              firstWinnerScore =
                Array.from(board.numbers.keys())
                  .filter((i) => !board.marked.includes(i))
                  .reduce((acc, next) => acc + next, 0) * drawnNumber;
            }
            if (!board.won) {
              board.won = true;
              winnersCount++;
              if (winnersCount === boards.length) {
                lastWinnerScore =
                  Array.from(board.numbers.keys())
                    .filter((i) => !board.marked.includes(i))
                    .reduce((acc, next) => acc + next, 0) * drawnNumber;
              }
            }
          }
        }
      }
    }
    return {
      firstWinnerScore,
      lastWinnerScore,
    };
  }

  private buildBoard() {
    let splitInput = this.input.split('\n');
    const numbersToDraw = splitInput[0].split(',').map((n) => +n);
    splitInput = splitInput.slice(2);
    const boards = [];
    let currentBoard: Board = {
      numbers: new Map(),
      marked: [],
      markedRows: { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0 },
      markedCols: { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0 },
      won: false,
    };
    let rowIndex = 0;
    for (const currentLine of splitInput) {
      if (currentLine === '') {
        boards.push(currentBoard);
        rowIndex = 0;
        currentBoard = {
          numbers: new Map(),
          marked: [],
          markedRows: { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0 },
          markedCols: { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0 },
          won: false,
        };
      } else {
        const matched = currentLine.match(
          /(\d+)\s*(\d+)\s*(\d+)\s*(\d+)\s*(\d+)/
        );
        const rowNumbers = matched.slice(1).map((m) => +m);
        for (let i = 0; i < rowNumbers.length; i++) {
          currentBoard.numbers.set(rowNumbers[i], { row: rowIndex, col: i });
        }
        rowIndex++;
      }
    }
    boards.push(currentBoard);
    return {
      numbersToDraw,
      boards,
    };
  }

  public solveFirst(): string {
    const { numbersToDraw, boards } = this.buildBoard();
    const { firstWinnerScore } = this.computeWinningScores(
      numbersToDraw,
      boards
    );
    return firstWinnerScore.toString();
  }

  public getFirstExpectedResult(): string {
    return '4512';
  }

  public solveSecond(): string {
    const { numbersToDraw, boards } = this.buildBoard();
    const { lastWinnerScore } = this.computeWinningScores(
      numbersToDraw,
      boards
    );
    return lastWinnerScore.toString();
  }

  public getSecondExpectedResult(): string {
    return '1924';
  }
}
