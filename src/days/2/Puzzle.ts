import Puzzle from '../../types/AbstractPuzzle';
import * as _ from 'lodash';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const result = this.input.split('\n').map(x=>this.GetPoint(x));
    return _.sum(result).toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '15';
  }

  public solveSecond(): string {
    // WRITE SOLUTION FOR TEST 2
    const result = this.input.split('\n').map(x=>this.GetPointPart2(x));
    return _.sum(result).toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '12';
  }
  
  private GetPoint(strategy:string) :number {
    
    switch (strategy[0]) {
      case 'A':
        return this.GetRockPoints(strategy[2]);
      case 'B':
        return this.GetPaperPoints(strategy[2]);
      case 'C':
        return this.GetScissorPoints(strategy[2]);
    }
    return 0;
  }
  
  private GetRockPoints(strategy:string) :number {

    switch (strategy) {
      case 'X': // We play Rock
        return 1 + 3;
      case 'Y': // We play Paper
        return 2 + 6;
      case 'Z': // We play scissors
        return 3;
    }
    return -10000;
  }

  private GetPaperPoints(strategy:string) :number {

    switch (strategy) {
      case 'X': // We play Rock
        return 1;
      case 'Y': // We play Paper
        return 2 + 3;
      case 'Z': // We play scissors
        return 3 + 6;
    }
    return -10000;
  }

  private GetScissorPoints(strategy:string) :number {

    switch (strategy) {
      case 'X': // We play Rock
        return 1 + 6;
      case 'Y': // We play Paper
        return 2;
      case 'Z': // We play scissors
        return 3 + 3;
    }
    return -100000;
  }

  private GetPointPart2(strategy:string) :number {

    switch (strategy[0]) {
      case 'A':
        return this.GetRockPointsPart2(strategy[2]);
      case 'B':
        return this.GetPaperPointsPart2(strategy[2]);
      case 'C':
        return this.GetScissorPointsPart2(strategy[2]);
    }
    return 0;
  }

  private GetRockPointsPart2(strategy:string) :number {

    switch (strategy) {
      case 'X': // We need to lose so we play scissors
        return 3;
      case 'Y': // We play to draw so we play Rock
        return 1 + 3;
      case 'Z': // We play to win so we play paper
        return 2 + 6;
    }
    return -10000;
  }

  private GetPaperPointsPart2(strategy:string) :number {

    switch (strategy) {
      case 'X': // We need to lose so we play Rock
        return 1;
      case 'Y': // We play to draw so we play paper
        return 2 + 3;
      case 'Z': // We play to win so we play scissors
        return 3 + 6;
    }
    return -10000;
  }

  private GetScissorPointsPart2(strategy:string) :number {

    switch (strategy) {
      case 'X': // We need to lose so we play Paper
        return 2;
      case 'Y': // We play to draw so we play scissors
        return 3 + 3;
      case 'Z': // We play to win so we play Rock
        return 1 + 6;
    }
    return -100000;
  }
  
}
