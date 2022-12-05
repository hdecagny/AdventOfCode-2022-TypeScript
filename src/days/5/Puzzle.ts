import Puzzle from '../../types/AbstractPuzzle';
import * as _ from 'lodash';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const lines = this.input.split('\r\n');
    const originalPositionInput = _.filter(lines, this.IsConstructionLine);
    const originalInput = this.CreateOriginalInput(originalPositionInput);
        
    return 'solution 1';
  }
  
  private CreateOriginalInput(input : string[]) : Array<Array<string>> {
    
    const stringLength = input[0].length;
    const numberOfColumns = (stringLength+1)/4;
    const result = new Array<Array<string>>();
    
    for (let i = 0; i< numberOfColumns; i++) {
      const column = new Array<string>();
      
      for (let j = 0; j< input.length; j++) {
        if (input[j][4*i+1].match(/[A-Z]/g)!=null) {
          column.push(input[j][4*i+1]);
      }
    }
      result.push(column);
  }
    return result;
  }
  
  private IsConstructionLine(line : string) : boolean {
    const filter =  line.match(/[A-Z]/g);
        return filter!=null;
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return 'solution 1';
  }

  public solveSecond(): string {
    // WRITE SOLUTION FOR TEST 2
    return 'solution 2';
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'solution 2';
  }
}
