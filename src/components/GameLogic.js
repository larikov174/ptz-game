import CONST from '../utils/constants';

export default class GameLogic extends Phaser.Scene {
  constructor() {
    super('GameLogic');
  }

  isInGrid(x, y, grid) {
    return x >= 0 && x < CONST.INLINE_LIMIT && y >= 0 && y < CONST.INLINE_LIMIT && grid[x][y] !== undefined;
  }

  setEmpty(x, y, grid) {
    grid[x][y].isEmpty = true;
  }

  _isEmpty(x, y, grid) {
    return grid[x][y].isEmpty;
  }

  _ascentEmptys(x, y, grid) {
    Phaser.Utils.Array.SendToBack(grid[x], grid[x][y]);
  }

  pullUpEmptys(grid) {
    for (let i = 0; i < CONST.INLINE_LIMIT; i++) {
      for (let j = 1; j < CONST.INLINE_LIMIT; j++) {
        if (this._isEmpty(i, j, grid)) this._ascentEmptys(i, j, grid);
      }
    }
  }

  addScore(connected, score) {
    if (connected.length === 2) {
      return (score += 2);
    }
    if (connected.length === 3) {
      return (score += Math.ceil(connected.length * 1.5));
    }
    if (connected.length === 4) {
      return (score += Math.ceil(connected.length * 2));
    }
    if (connected.length >= 5) {
      return (score += Math.ceil(connected.length * 3));
    }
  }

  isCubeChecked(x, y, array) {
    return array.some((item) => item.x === x && item.y === y);
  }
}
