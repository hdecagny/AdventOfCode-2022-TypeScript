import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  
  private SplitElf() : string[] {
    return this.input.split('\r\n\r\n');
}

  private GetTotalFood(elfInput : string) : number {
    
    const listOfFood = elfInput.split('\r\n').map(x=>+x);
    return listOfFood.reduce((sum, current) => sum + current, 0);
  }
  
  public solveFirst(): string {
    
    const foodPerElf = this.SplitElf();
    const totalFoodPerElf = foodPerElf.map(x=>this.GetTotalFood(x));
    
    return Math.max(...totalFoodPerElf).toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '24000';
  }

  public solveSecond(): string {
    // WRITE SOLUTION FOR TEST 2
    const foodPerElf = this.SplitElf();
    const totalFoodPerElfSorted = foodPerElf.map(x=>this.GetTotalFood(x)).sort((x, y) => y-x);
    const answer = totalFoodPerElfSorted[0] + totalFoodPerElfSorted[1] + totalFoodPerElfSorted[2];
    
    return answer.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '45000';
  }
}
