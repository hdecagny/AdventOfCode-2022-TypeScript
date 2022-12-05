import PuzzleFactory from '../../utils/PuzzleFactory';

describe('day 4', () => {
  test('puzzle 1', async () => {
    const puzzle = await PuzzleFactory.getPuzzle('4', 'test');
    expect(puzzle.solveFirst()).toEqual(puzzle.getFirstExpectedResult());
  });

  test('puzzle 2', async () => {
    const puzzle = await PuzzleFactory.getPuzzle('4', 'test');
    expect(puzzle.solveSecond()).toEqual(puzzle.getSecondExpectedResult());
  });
});
