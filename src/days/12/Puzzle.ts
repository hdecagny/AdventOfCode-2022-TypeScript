import Puzzle from '../../types/AbstractPuzzle';

type Node = {
  adj: string[];
};

export default class ConcretePuzzle extends Puzzle {
  private buildNodesList() {
    return this.input.split('\n').reduce((acc, next) => {
      const [a, b] = next.split('-');
      let alreadyIn = acc.get(a);
      if (alreadyIn) {
        alreadyIn.adj.push(b);
      } else {
        acc.set(a, { adj: [b] });
      }
      alreadyIn = acc.get(b);
      if (alreadyIn) {
        alreadyIn.adj.push(a);
      } else {
        acc.set(b, { adj: [a] });
      }

      return acc;
    }, new Map<string, Node>());
  }

  public solveFirst(): string {
    const nodes = this.buildNodesList();
    const paths: string[][] = [];
    const alreadyVisited = new Map<string, number>();
    this.buildPaths(nodes, 'start', ['start'], paths, alreadyVisited, false);
    return paths.length.toString();
  }

  private buildPaths(
    nodes: Map<string, Node>,
    startNode: string,
    currentPath: string[],
    pathsList: string[][],
    alreadyVisited: Map<string, number>,
    allowMaxVisits: boolean
  ) {
    if (startNode == 'end') {
      pathsList.push([...currentPath]);
      return;
    }

    const start = nodes.get(startNode);
    for (const currentNodeName of start.adj.filter((n) => n !== 'start')) {
      // if lowerCase, check if not visited
      if (currentNodeName === currentNodeName.toLowerCase()) {
        // if small cave
        // if there is one visited twice
        //  others can be visited once
        // if there is no cave visited twice
        // can vistit any, even twice
        let maxVisits = 1;
        if (allowMaxVisits) {
          let hasMax = false;
          for (const node of alreadyVisited) {
            if (node[1] === 2) {
              maxVisits = 1;
              hasMax = true;
              break;
            }
          }
          if (!hasMax) {
            maxVisits = 2;
          }
        }

        const alreadyVisitedNodeCount = alreadyVisited.get(currentNodeName);
        if (!alreadyVisitedNodeCount || alreadyVisitedNodeCount < maxVisits) {
          const newMap = new Map(alreadyVisited);
          newMap.set(
            currentNodeName,
            isNaN(alreadyVisitedNodeCount) ? 1 : alreadyVisitedNodeCount + 1
          );
          this.buildPaths(
            nodes,
            currentNodeName,
            [...currentPath, currentNodeName],
            pathsList,
            newMap,
            allowMaxVisits
          );
        }
      } else {
        this.buildPaths(
          nodes,
          currentNodeName,
          [...currentPath, currentNodeName],
          pathsList,
          new Map(alreadyVisited),
          allowMaxVisits
        );
      }
    }
  }

  public getFirstExpectedResult(): string {
    return '10';
  }

  public solveSecond(): string {
    const nodes = this.buildNodesList();
    const paths: string[][] = [];
    const alreadyVisited = new Map<string, number>();
    this.buildPaths(nodes, 'start', ['start'], paths, alreadyVisited, true);
    return paths.length.toString();
  }

  public getSecondExpectedResult(): string {
    return '36';
  }
}
