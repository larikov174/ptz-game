import Phaser from 'phaser';
import SFX from './SFX';
import GameLogic from './GameLogic';
import ProgressBar from '../ui/ProgressBar';
import LabelCreator from '../ui/LabelCreator';
import FONT_PROPS from '../ui/FontProps';
import CONST from '../utils/constants';

const { FRAMES, HIGHSCORE, SCORE, GOAL, MOVES, LEVEL, CUBE_HEIGHT, CUBE_WIDTH, INLINE_LIMIT, START_Y, START_X } = CONST;
const { FAMILY, FILL } = FONT_PROPS;
const { SIZE_XL, SIZE_M } = FONT_PROPS.SIZE;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  init() {
    this.grid = [];
    this.connected = [];
    this.possibleMoves = [];
    this.chosenColor = null;
    this.highscore = localStorage.highscore ? JSON.parse(localStorage.highscore) : HIGHSCORE;
    this.camera = this.cameras.add();
  }

  preload() {
    this.cameras.main.fadeIn(250);
  }

  create() {
    this.logic = new GameLogic();
    this.sfx = new SFX({
      sprites: this.add.particles('sprites'),
      frames: FRAMES,
    });

    this.progressOverlay = this.createBar(420, 0x001a3e);
    this.progressBar = this.createBar(0, 0x199d21);

    this.scoreLabel = this.createLabel(0, 0, SCORE, SIZE_M);
    this.goalLabel = this.createLabel(0, 0, GOAL, SIZE_M);
    this.movesLabel = this.createLabel(0, 0, MOVES, SIZE_XL);
    this.highscoreLabel = this.createLabel(0, 0, this.highscore, SIZE_M);
    this.levelLabel = this.createLabel(0, 0, LEVEL, SIZE_M);
    this.slash = this.createLabel(0, 0, '/', SIZE_M);

    this.createUI();
    this.createGrid();

    this.registry.set('moves', this.movesLabel.get());
    this.registry.set('level', this.levelLabel.get());
    this.registry.set('new', false);
    this.registry.events.on('changedata', this.updateData, this);

    // emmit click event on each cube
    this.input.on('gameobjectdown', (pointer, gameObject) => gameObject.emit('clicked', gameObject), this);
  }

  createLabel(x, y, value, size) {
    const style = { fontSize: `${size}px`, fill: FILL, fontFamily: FAMILY };
    const label = new LabelCreator(this, x, y, value, style);
    this.add.existing(label);
    label.depth = 1;
    return label;
  }

  createBar(width, color) {
    const bar = new ProgressBar(this, 0, 0, width, 30, color);
    this.add.existing(bar);
    return bar;
  }

  createUI() {
    const gameWidth = this.sys.game.config.width;
    const gameHeigth = this.sys.game.config.height;
    const screenCenter = this.add.zone(gameWidth / 2, gameHeigth / 2, gameWidth, gameHeigth);
    const field = this.add.image(0, 0, 'sprites', 'field');
    const header = this.add.image(0, 0, 'sprites', 'bar1');
    const scoreboard = this.add.image(0, 0, 'sprites', 'scoreboard');

    header.depth = -1;

    Phaser.Display.Align.In.BottomLeft(field, screenCenter);
    Phaser.Display.Align.In.TopCenter(header, screenCenter);
    Phaser.Display.Align.In.RightCenter(scoreboard, screenCenter);
    Phaser.Display.Align.In.QuickSet(this.progressOverlay, header, 6, -35, 0);
    Phaser.Display.Align.In.QuickSet(this.progressBar, this.progressOverlay, 3, 0, 0);
    Phaser.Display.Align.In.QuickSet(this.scoreLabel, scoreboard, 11, -50, -60);
    Phaser.Display.Align.In.QuickSet(this.slash, scoreboard, 11, 0, -60);
    Phaser.Display.Align.In.QuickSet(this.goalLabel, scoreboard, 11, 50, -60);
    Phaser.Display.Align.In.QuickSet(this.highscoreLabel, header, 2, -170, -32);
    Phaser.Display.Align.In.QuickSet(this.movesLabel, scoreboard, 6, 0, -70);
    Phaser.Display.Align.In.QuickSet(this.levelLabel, header, 4, -120, -10);

    this.add.group({
      key: 'sprites',
      frame: ['bonus'],
      frameQuantity: 3,
      gridAlign: {
        width: 3,
        height: 1,
        cellWidth: CUBE_WIDTH * 2,
        cellHeight: CUBE_HEIGHT,
        x: 660,
        y: 700,
      },
      setScale: { x: 0.8, y: 0.8 },
    });
  }

  //render cubes and connect them to the grid
  createCube(data) {
    const block = this.add.sprite(data.sx, data.sy, 'sprites', FRAMES[data.color]);
    block.gridData = data;
    data.sprite = block;
    block.setInteractive();
    block.on('clicked', this.clickHandler, this);
  }

  renderGrid() {
    for (let i = 0; i < INLINE_LIMIT; i++) {
      for (let j = 0; j < INLINE_LIMIT; j++) {
        let currentCube = this.grid[i][j];
        this.createCube(currentCube);
      }
    }
  }

  createGrid() {
    for (let x = 0; x < INLINE_LIMIT; x++) {
      this.grid[x] = [];
      for (let y = 0; y < INLINE_LIMIT; y++) {
        const sx = START_X + x * CUBE_WIDTH;
        const sy = START_Y + y * CUBE_HEIGHT;
        const color = Phaser.Math.Between(0, 4);
        const id = Phaser.Utils.String.UUID();
        this.grid[x][y] = { x, y, sx, sy, color, id, isEmpty: false };
      }
    }
    this.renderGrid();
    this.getPossibleMoves();
  }

  //check if neighbour cube is the same color
  getConnected(x, y) {
    if (!this.logic.isInGrid(x, y, this.grid) || this.grid[x][y].isEmpty) return null;
    let currentCube = this.grid[x][y];
    if (currentCube.color === this.chosenColor && !this.logic.isCubeChecked(x, y, this.connected)) {
      //making an array of connected cubes
      this.connected.push({ x, y, id: currentCube.id, sprite: currentCube.sprite });
      this.getConnected(x + 1, y);
      this.getConnected(x - 1, y);
      this.getConnected(x, y + 1);
      this.getConnected(x, y - 1);
    }
  }

  //check if player can go on
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

  connectedItems(x, y) {
    this.connected.length = 0;
    this.getConnected(x, y);
  }

  //redraw cubes with new coordinates
  reassignCoords() {
    this.grid.forEach((item) => {
      for (let i = 0; i < INLINE_LIMIT; i++) {
        item[i].y = item.indexOf(item[i]);
        item[i].sy = START_Y + CUBE_HEIGHT * item[i].y;
        this.tweens.timeline({
          targets: item[i].sprite,
          tweens: [{ y: item[i].sy }, { alpha: 1 }],
          duration: 250,
          callbackScope: this,
        });
      }
    });
  }

  handleEmptys() {
    this.logic.pullUpEmptys(this.grid);
    this.reassignCoords();
  }

  refill() {
    this.grid.forEach((item) => {
      for (let i = 0; i < INLINE_LIMIT; i++) {
        if (item[i].isEmpty) {
          const color = Phaser.Math.Between(0, 4);
          item[i].isEmpty = false;
          item[i].sprite.setFrame(FRAMES[color]);
          item[i].color = color;
        }
      }
    });
  }

  clickHandler(block) {
    this.getPossibleMoves();
    this.chosenColor = block.gridData.color;
    this.connectedItems(block.gridData.x, block.gridData.y);
    if (this.connected.length > 1) {
      let deleted = 0;
      this.scoreLabel.addScore(this.connected.length);
      this.movesLabel.reduce(1);
      this.registry.set('moves', this.movesLabel.get());
      this.connected.forEach((cube) => {
        deleted++;
        this.tweens.timeline({
          targets: cube.sprite,
          tweens: [{ alpha: 1 }, { y: 190 }],
          duration: 0,
          callbackScope: this,
          onComplete: () => {
            deleted--;
            this.logic.setEmpty(cube.x, cube.y, this.grid);
            if (deleted === 0) {
              this.handleEmptys();
              this.refill();
            }
          },
        });
      });
    }
  }

  gameOver(cam = null, progress = 0) {
    if (progress === 1) this.scene.start('GameOver');
  }

  cameraFadeOut(cam = null, progress = 0) {
    if (progress === 1) this.camera.fade(1000, 0, 0, 0, false, this.gameOver);
  }

  onGameLoose() {
    const score = this.scoreLabel.get();
    if (score > this.highscore) {
      this.registry.set('new', true);
      localStorage.setItem('highscore', score);
    }
    this.camera.shake(1000, 0.04, false, this.cameraFadeOut);
  }

  levelChange() {
    this.movesLabel.set(10);
    this.levelLabel.add(1);
    this.goalLabel.add(Math.ceil(this.goalLabel.get() * 1.5));
    this.registry.set('level', this.levelLabel.get());
  }

  onGameWin() {
    this.sfx.emitt();
    this.levelChange();
  }

  updateData(parent, key, data) {
    const moves = this.movesLabel.get();
    const score = this.scoreLabel.get();
    const goal = this.goalLabel.get();
    const dynemicWidth = 420 * (score / goal);

    if (key === 'moves') {
      this.progressBar.redraw(dynemicWidth)
      if (moves === 0 || this.possibleMoves.length === 0) this.onGameLoose();
      if (score >= goal) this.onGameWin();
    }

    if (key === 'level') {
      this.progressBar.redraw(dynemicWidth);
    }
  }
}
