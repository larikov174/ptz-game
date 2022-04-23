import Phaser from 'phaser';
import CONST from '../utils/constants';

const { INLINE_LIMIT, FRAMES, START_Y, START_X, CUBE_HEIGHT, CUBE_WIDTH } = CONST;

export default class GameLogic extends Phaser.Scene {
  constructor(grid, connected, possibleMoves, handler, scene) {
    super('GameLogic');
    this.grid = grid;
    this.connected = connected;
    this.possibleMoves = possibleMoves;
    this.handler = handler;
    this.scene = scene;
  }

  _isInGrid(x, y) {
    return x >= 0 && x < INLINE_LIMIT && y >= 0 && y < INLINE_LIMIT && this.grid[x][y] !== undefined;
  }

  _ascentEmptys(x, y) {
    Phaser.Utils.Array.SendToBack(this.grid[x], this.grid[x][y]);
  }

  _pullUpEmptys() {
    for (let i = 0; i < INLINE_LIMIT; i++) {
      for (let j = 1; j < INLINE_LIMIT; j++) {
        if (this.isEmpty(i, j)) this._ascentEmptys(i, j, this.grid);
      }
    }
  }

  _isCubeChecked(x, y) {
    return this.connected.some((item) => item.x === x && item.y === y);
  }

  _getConnections(x, y, color) {
    if (!this._isInGrid(x, y) || this.isEmpty(x, y)) return null;
    const currentCube = this.grid[x][y];
    if (currentCube.color === color && !this._isCubeChecked(x, y)) {
      this.connected.push({ x, y, id: currentCube.id, sprite: currentCube.sprite });
      this._getConnections(x + 1, y, color);
      this._getConnections(x - 1, y, color);
      this._getConnections(x, y + 1, color);
      this._getConnections(x, y - 1, color);
    }
  }

  _refill() {
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

  _reassignCoords(tweens) {
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

  _createCube(x, y) {
    const block = this.scene.add.sprite(this.grid[x][y].sx, this.grid[x][y].sy, 'sprites', FRAMES[this.grid[x][y].color]);
    block.gridData = this.grid[x][y];
    this.grid[x][y].sprite = block;
    block.setInteractive();
    block.setScale(0.5)
    block.on('clicked', this.handler, this.scene);
  }

  setEmpty(x, y) {
    this.grid[x][y].isEmpty = true;
  }

  isEmpty(x, y) {
    return this.grid[x][y].isEmpty;
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
    this._getConnections(x, y, color);
  }

  handleEmptys(tweens) {
    this._pullUpEmptys();
    this._reassignCoords(tweens);
    this._refill();
  }

  createGrid() {
    for (let x = 0; x < INLINE_LIMIT; x++) {
      this.grid[x] = [];
      for (let y = 0; y < INLINE_LIMIT; y++) {
        const sx = START_X + x * CUBE_WIDTH;
        const sy = START_Y + y * CUBE_HEIGHT;
        const color = Phaser.Math.Between(0, FRAMES.length - 1);
        const id = Phaser.Utils.String.UUID();
        this.grid[x][y] = { x, y, sx, sy, color, id, isEmpty: false };
        this._createCube(x, y, this.handler, this.scene);
      }
    }
    this.getPossibleMoves();
  }
}
