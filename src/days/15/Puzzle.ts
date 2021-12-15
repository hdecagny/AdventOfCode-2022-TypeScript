import Puzzle from '../../types/AbstractPuzzle';

type Node = { i: number; j: number; cost: number };

export default class ConcretePuzzle extends Puzzle {
  private readonly NEIGHBOORS = [
    [-1, 0],
    [+1, 0],
    [0, -1],
    [0, +1],
  ];

  public solveFirst(): string {
    const world: number[][] = [];
    const unvisitedMap = new Map<string, Node>();
    const lines = this.input.split('\n');
    for (let i = 0; i < lines.length; i++) {
      world[i] = new Array(lines[i].length);
      for (let j = 0; j < lines[i].length; j++) {
        world[i][j] = +lines[i][j];
        unvisitedMap.set(`${i}-${j}`, { i, j, cost: Number.MAX_SAFE_INTEGER });
      }
    }

    const end: Node = {
      i: world.length - 1,
      j: world[0].length - 1,
      cost: world[world.length - 1][world[0].length - 1],
    };
    return this.dijkstra(world, unvisitedMap, end);
  }

  private dijkstra(
    world: number[][],
    unvisitedMap: Map<string, Node>,
    end: Node
  ) {
    let current = unvisitedMap.get(`0-0`);
    current.cost = 0;

    while (unvisitedMap.size > 0) {
      if (current.i === end.i && current.j === end.j) {
        return current.cost.toString();
      }

      const unvisitedAdjs = [];
      for (const currentNeighboor of this.NEIGHBOORS) {
        const newI = current.i + currentNeighboor[0];
        const newJ = current.j + currentNeighboor[1];

        if (
          newI >= 0 &&
          newI < world.length &&
          newJ >= 0 &&
          newJ < world[0].length
        ) {
          const unvisitedNodeCost = unvisitedMap.get(`${newI}-${newJ}`);
          if (unvisitedNodeCost) {
            unvisitedAdjs.push(unvisitedNodeCost);
          }
        }
      }

      for (const unvisited of unvisitedAdjs) {
        const newCost = current.cost + world[unvisited.i][unvisited.j];

        if (unvisited.cost > newCost) {
          unvisited.cost = newCost;
        }
      }

      unvisitedMap.delete(`${current.i}-${current.j}`);

      let min = Number.MAX_SAFE_INTEGER;
      let currentMinItem = undefined;
      for (const entry of unvisitedMap) {
        const node = entry[1];

        if (node.cost < min) {
          min = node.cost;
          currentMinItem = node;
        }
      }

      current = currentMinItem;
    }

    return current.cost.toString();
  }

  public getFirstExpectedResult(): string {
    return '40';
  }

  public solveSecond(): string {
    const smallWorld: number[][] = [];
    const lines = this.input.split('\n');
    for (let i = 0; i < lines.length; i++) {
      smallWorld[i] = new Array(lines[i].length);
      for (let j = 0; j < lines[i].length; j++) {
        smallWorld[i][j] = +lines[i][j];
      }
    }

    const tilesChace = new Map<number, number[][]>();
    tilesChace.set(0, smallWorld);
    const worldTiles = new Array(5);

    worldTiles[0] = new Array(5);
    for (let i = 0; i < worldTiles.length; i++) {
      worldTiles[i] = new Array(worldTiles.length);
      let incrementIndex = i;
      for (let j = 0; j < worldTiles[i].length; j++) {
        // console.log(i, j, indexStart++);
        const tile = tilesChace.get(incrementIndex);
        if (tile) {
          worldTiles[i][j] = tile;
        } else {
          const newTile = this.buildTile(tilesChace.get(incrementIndex - 1));
          tilesChace.set(incrementIndex, newTile);
          worldTiles[i][j] = newTile;
        }

        incrementIndex++;
      }
    }

    const world = new Array(worldTiles.length * smallWorld.length);
    for (let i = 0; i < world.length; i++) {
      world[i] = new Array(worldTiles.length * smallWorld.length);
    }
    for (let i = 0; i < worldTiles.length; i++) {
      for (let j = 0; j < worldTiles[0].length; j++) {
        const currentTile = worldTiles[i][j];
        for (let y = 0; y < currentTile.length; y++) {
          for (let x = 0; x < currentTile[y].length; x++) {
            world[y + i * currentTile.length][x + j * currentTile[i].length] =
              currentTile[y][x];
          }
        }
      }
    }

    const unvisited = new Map<string, Node>();
    for (let i = 0; i < world.length; i++) {
      for (let j = 0; j < world[i].length; j++) {
        unvisited.set(`${i}-${j}`, { i, j, cost: Number.MAX_SAFE_INTEGER });
      }
    }
    const end: Node = {
      i: world.length - 1,
      j: world[0].length - 1,
      cost: world[world.length - 1][world[0].length - 1],
    };
    return this.dijkstra(world, unvisited, end);
  }

  private buildTile(smallWorld: number[][]) {
    const tile = new Array(smallWorld.length);
    for (let i = 0; i < smallWorld.length; i++) {
      tile[i] = new Array(smallWorld[0].length);
      for (let j = 0; j < smallWorld[i].length; j++) {
        tile[i][j] = smallWorld[i][j] + 1 > 9 ? 1 : smallWorld[i][j] + 1;
      }
    }
    return tile;
  }

  public getSecondExpectedResult(): string {
    return '315';
  }
}
