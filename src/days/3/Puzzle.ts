import Puzzle from '../../types/AbstractPuzzle';
import * as _ from 'lodash';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const backpacks = this.input.split('\r\n');
    
    return _.sum(backpacks.map(x=> this.GetPriority(x))).toString();
  }
  
  private GetPriority(backpack : string) : number {
    const length = backpack.length;
    const firstSack = backpack.slice(0, length/2).split('');
    const secondSack = backpack.slice(length/2).split('');
    
    const doubletons = firstSack.filter(value => secondSack.includes(value));
    const result = this.MapPriority(doubletons[0]);
    
    return result;
  }
  
  private MapPriority(character : string) : number {
    const code = character.charCodeAt(0);
    
    if (code > 96) {
      return code - 96;
    }
    return code - 38;
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '157';
  }

  public solveSecond(): string {
    const backpacks = this.input.split('\r\n');
    
    const backpackNumbers = backpacks.length;
    
    let result = 0;
    
    for (let i=0; i<backpackNumbers-1; i=i+3) {
      result = result + this.GetPriorityFromGroup(backpacks[i], backpacks[i+1], backpacks[i+2]);
    }
    
    return result.toString();
  }

  private GetPriorityFromGroup(backpack1 : string, backpack2:string, backpack3: string) : number {
    const sack1 = backpack1.split('');
    const sack2 = backpack2.split('');
    const sack3 = backpack3.split('');

    const filter1 = sack1.filter(value => sack2.includes(value));
    const filter2 = filter1.filter(value => sack3.includes(value));
    
    const result = this.MapPriority(filter2[0]);

    return result;
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '70';
  }
}
