import Phaser from 'phaser';
import CONST from '../utils/constants';

const { INLINE_LIMIT, FRAMES, START_Y, CUBE_HEIGHT } = CONST;

export default class GameLogic extends Phaser.Scene {
  constructor(grid, connected, possibleMoves) {
    super('GameLogic');
    this.grid = grid;
    this.connected = connected;
    this.possibleMoves = possibleMoves;
  }

  isInGrid(x, y) {
    return x >= 0 && x < INLINE_LIMIT && y >= 0 && y < INLINE_LIMIT && this.grid[x][y] !== undefined;
  }

  setEmpty(x, y) {
    this.grid[x][y].isEmpty = true;
  }

  isEmpty(x, y) {
    return this.grid[x][y].isEmpty;
  }

  _ascentEmptys(x, y) {
    Phaser.Utils.Array.SendToBack(this.grid[x], this.grid[x][y]);
  }

  pullUpEmptys() {
    for (let i = 0; i < INLINE_LIMIT; i++) {
      for (let j = 1; j < INLINE_LIMIT; j++) {
        if (this.isEmpty(i, j)) this._ascentEmptys(i, j, this.grid);
      }
    }
  }

  isCubeChecked(x, y) {
    return this.connected.some((item) => item.x === x && item.y === y);
  }

  getPossibleMoves() {
    this.possibleMoves.length = 0;
    for (let x = 0; x < INLINE_LIMIT - 1; x++) {
      for (let y = 0; y < INLINE_LIMIT - 1; y++) {
        if (
          this.grid[x][y].color === this.grid[x][y + 1].color ||
          this.grid[x][y].color === this.grid[x + 1][y].color
        ) {
          this.possibleMoves.push({ id: this.grid[x][y].id });
        }
      }
    }
  }

  findConnected(x, y, color) {
    this.connected.length = 0;
    this.getConnections(x, y, color);
  }

  getConnections(x, y, color) {
    if (!this.isInGrid(x, y) || this.isEmpty(x, y)) return null;
    const currentCube = this.grid[x][y];
    if (currentCube.color === color && !this.isCubeChecked(x, y)) {
      this.connected.push({ x, y, id: currentCube.id, sprite: currentCube.sprite });
      this.getConnections(x + 1, y, color);
      this.getConnections(x - 1, y, color);
      this.getConnections(x, y + 1, color);
      this.getConnections(x, y - 1, color);
    }
  }

  refill() {
    this.grid.forEach((item) => {
      for (let i = 0; i < INLINE_LIMIT; i++) {
        if (item[i].isEmpty) {
          const color = Phaser.Math.Between(0, FRAMES.length - 1);
          item[i].isEmpty = false;
          item[i].sprite.setFrame(FRAMES[color]);
          item[i].color = color;
        }
      }
    });
  }

  reassignCoords(tweens) {
    this.grid.forEach((item) => {
      for (let i = 0; i < INLINE_LIMIT; i++) {
        item[i].y = item.indexOf(item[i]);
        item[i].sy = START_Y + CUBE_HEIGHT * item[i].y;
        tweens.timeline({
          targets: item[i].sprite,
          tweens: [{ y: item[i].sy }, { alpha: 1 }],
          duration: 250,
          callbackScope: this,
        });
      }
    });
  }

  handleEmptys(tweens) {
    this.pullUpEmptys();
    this.reassignCoords(tweens);
    this.refill();
  }
}
