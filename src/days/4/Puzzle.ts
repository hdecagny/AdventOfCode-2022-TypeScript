import Puzzle from '../../types/AbstractPuzzle';
import * as _ from 'lodash';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const sections = this.input.split('\r\n');
    const result = _.sum(sections.map(x=> this.IsFullyContained(x) ? 1 : 0));
    
    return result.toString();
  }
  
  private IsFullyContained(section : string) : boolean {
    
    const numbers = section.replace('-', '$')
        .replace('-', '$')
        .replace(',', '$')
        .split('$')
        .map(x=>+x);
    
    if (numbers[0] <= numbers[2] && numbers[1] >= numbers[3]) {
      return true;
    }
    
    if (numbers[0] >= numbers[2] && numbers[1] <= numbers[3]) {
      return true;
    }
    return false;
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '2';
  }

  public solveSecond(): string {
    const sections = this.input.split('\r\n');
    const result = _.sum(sections.map(x=> this.DoesOverlap(x) ? 1 : 0));

    return result.toString();
  }

  private DoesOverlap(section : string) : boolean {

    const numbers = section.replace('-', '$')
        .replace('-', '$')
        .replace(',', '$')
        .split('$')
        .map(x => +x);

    return !(numbers[1] < numbers[2] || numbers[3] < numbers[0]);
  }
  
  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '4';
  }
}
