import PuzzleFactory from '../../utils/PuzzleFactory';

describe('day 15', () => {
  test('puzzle 1', async () => {
    const puzzle = await PuzzleFactory.getPuzzle('15', 'test');
    expect(puzzle.solveFirst()).toEqual(puzzle.getFirstExpectedResult());
  });

  test('puzzle 2', async () => {
    const puzzle = await PuzzleFactory.getPuzzle('15', 'test');
    expect(puzzle.solveSecond()).toEqual(puzzle.getSecondExpectedResult());
  });
});
