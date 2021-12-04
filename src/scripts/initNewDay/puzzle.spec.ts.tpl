import PuzzleFactory from '../../utils/PuzzleFactory';

describe('day ${day}', () => {
  test('puzzle 1', async () => {
    const puzzle = await PuzzleFactory.getPuzzle('${day}', 'test');
    expect(puzzle.solveFirst()).toEqual(puzzle.getFirstExpectedResult());
  });

  test('puzzle 2', async () => {
    const puzzle = await PuzzleFactory.getPuzzle('${day}', 'test');
    expect(puzzle.solveSecond()).toEqual(puzzle.getSecondExpectedResult());
  });
});
