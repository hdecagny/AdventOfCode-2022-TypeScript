import PuzzleFactory from '../../utils/PuzzleFactory';

describe('day 12', () => {
  test('puzzle 1', async () => {
    const puzzle = await PuzzleFactory.getPuzzle('12', 'test');
    expect(puzzle.solveFirst()).toEqual(puzzle.getFirstExpectedResult());
  });

  test('puzzle 2', async () => {
    const puzzle = await PuzzleFactory.getPuzzle('12', 'test');
    expect(puzzle.solveSecond()).toEqual(puzzle.getSecondExpectedResult());
  });
});
