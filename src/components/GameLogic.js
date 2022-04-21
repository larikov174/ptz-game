import CONST from '../utils/constants';

const { INLINE_LIMIT } = CONST;

export default class GameLogic extends Phaser.Scene {
  constructor() {
    super('GameLogic');
  }

  isInGrid(x, y, grid) {
    return x >= 0 && x < INLINE_LIMIT && y >= 0 && y < INLINE_LIMIT && grid[x][y] !== undefined;
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
    for (let i = 0; i < INLINE_LIMIT; i++) {
      for (let j = 1; j < INLINE_LIMIT; j++) {
        if (this._isEmpty(i, j, grid)) this._ascentEmptys(i, j, grid);
      }
    }
  }

  isCubeChecked(x, y, array) {
    return array.some((item) => item.x === x && item.y === y);
  }
}
