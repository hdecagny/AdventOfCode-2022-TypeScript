import PuzzleFactory from './utils/PuzzleFactory';

// const args: { [key: string]: string } = process.argv
//   .slice(2)
//   .reduce((acc, next, i) => {
//     const match = next.match(/--(\S+)=/);
//     if (match) {
//       const splitted = next.split(match[0]);
//       acc[match[1]] = splitted[1];
//     } else {
//       acc[i] = next;
//     }
//     return acc;
//   }, {} as { [key: string]: string });

const args = process.argv.slice(2);
const inputFile = args[0];
const dayToSolve = args[1];
const puzzleToSolve = args[2];

if (!inputFile) {
  console.error(
    'No input file specified run with npm run dev {fileName} {day} [{puzzle}]'
  );
  process.exit(1);
}

if (!dayToSolve) {
  console.error(
    'No day specified run with npm run dev {fileName} {day} [{puzzle}]'
  );
  process.exit(1);
}

const runner = (solver: () => string, runnerName: string): void => {
  console.time(runnerName);
  const result = solver();
  console.timeEnd(runnerName);
  console.log(`Result: ${result}`);
};

console.log(
  `Solving Day #${dayToSolve},${
    puzzleToSolve ? ` Puzzle #${puzzleToSolve},` : ''
  } running with ${inputFile}`
);
(async () => {
  const puzzle = await PuzzleFactory.getPuzzle(dayToSolve, inputFile);
  if (puzzleToSolve === '1') {
    runner(() => puzzle.solveFirst(), 'Problem 1');
  } else if (puzzleToSolve === '2') {
    runner(() => puzzle.solveSecond(), 'Problem 2');
  } else {
    runner(() => puzzle.solveFirst(), 'Problem 1');
    runner(() => puzzle.solveSecond(), 'Problem 2');
  }
})();
