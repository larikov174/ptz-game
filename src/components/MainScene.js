import Phaser from 'phaser';
import SFX from './SFX';
import GameLogic from './GameLogic';
import ScoreLabel from '../ui/ScoreLabel'
import FONT_PROPS from '../utils/utils';
import SETUP from '../utils/setup';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.ScoreLabel = undefined;
  }

  init() {
    this.gameWidth = this.sys.game.config.width;
    this.gameHeigth = this.sys.game.config.height;
    this.sceneZone = this.add.zone(this.gameWidth / 2, this.gameHeigth / 2, this.gameWidth, this.gameHeigth);
    this.grid = [];
    this.connected = [];
    this.possibleMoves = [];
    this.chosenColor = null;
    this.highscore = localStorage.highscore ? JSON.parse(localStorage.highscore) : SETUP.HIGHSCORE;
    this.levelText = '';
    this.movesText = '';
    this.scoreText = '';
    this.highscoreText = '';
    this.progressBar = this.add.graphics({ fillStyle: { color: 0x199d21 } });
    this.progressOverlay = this.add.graphics({ fillStyle: { color: 0x001a3e } });
    this.rectBar = new Phaser.Geom.Rectangle(250, 45, 0, 30);
    this.rectOverlay = new Phaser.Geom.Rectangle(250, 45, 420, 30);
    this.camera = this.cameras.add();
  }

  preload() {
    this.cameras.main.fadeIn(250);
  }

  create() {
    this.logic = new GameLogic();
    this.sfx = new SFX({
      sprites: this.add.particles('sprites'),
      frames: SETUP.FRAMES,
    });

    this.createUI();
    this.createGrid();
    this.registry.set('score', SETUP.SCORE);
    this.registry.set('moves', SETUP.MOVES);
    this.registry.set('level', SETUP.LEVEL);
    this.registry.set('goal', SETUP.GOAL);
    this.registry.set('highscore', this.highscore);
    this.registry.set('new', false);
    this.registry.events.on('changedata', this.updateData, this);

    // emmit click event on each cube
    this.input.on('gameobjectdown', (pointer, gameObject) => gameObject.emit('clicked', gameObject), this);
  }

  createUI() {
    let field = this.add.image(0, 0, 'sprites', 'field');
    Phaser.Display.Align.In.BottomLeft(field, this.sceneZone);

    let header = this.add.image(0, 0, 'sprites', 'bar1');
    Phaser.Display.Align.In.TopCenter(header, this.sceneZone);
    header.depth = -2;

    this.progressOverlay.fillRectShape(this.rectOverlay);
    this.progressOverlay.depth = 0;
    this.progressBar.depth = 1;

    let scoreboard = this.add.image(0, 0, 'sprites', 'scoreboard');
    Phaser.Display.Align.In.RightCenter(scoreboard, this.sceneZone);

    this.add.group({
      key: 'sprites',
      frame: ['bonus'],
      frameQuantity: 3,
      gridAlign: {
        width: 3,
        height: 1,
        cellWidth: SETUP.CUBE_WIDTH * 2,
        cellHeight: SETUP.CUBE_HEIGHT,
        x: 660,
        y: 700,
      },
      setScale: { x: 0.8, y: 0.8 },
    });

    this.scoreText = this.make.text(FONT_PROPS(`${SETUP.SCORE} / ${SETUP.GOAL}`, 32));
    Phaser.Display.Align.In.QuickSet(this.scoreText, scoreboard, 11, 0, -60);

    this.highscoreText = this.make.text(FONT_PROPS(this.highscore, 32));
    Phaser.Display.Align.In.QuickSet(this.highscoreText, header, 2, -170, -32);

    this.movesText = this.make.text(FONT_PROPS(SETUP.MOVES, 100));
    Phaser.Display.Align.In.QuickSet(this.movesText, scoreboard, 6, 0, -70);

    this.levelText = this.make.text(FONT_PROPS(SETUP.LEVEL, 32));
    Phaser.Display.Align.In.QuickSet(this.levelText, header, 4, -120, -10);
  }

  //render cubes and connect them to the grid
  createCube(data) {
    const block = this.add.sprite(data.sx, data.sy, 'sprites', SETUP.FRAMES[data.color]);
    block.gridData = data;
    data.sprite = block;
    block.setInteractive();
    block.on('clicked', this.clickHandler, this);
  }

  renderGrid() {
    for (let i = 0; i < SETUP.INLINE_LIMIT; i++) {
      for (let j = 0; j < SETUP.INLINE_LIMIT; j++) {
        let currentCube = this.grid[i][j];
        this.createCube(currentCube);
      }
    }
  }

  createGrid() {
    for (let x = 0; x < SETUP.INLINE_LIMIT; x++) {
      this.grid[x] = [];
      for (let y = 0; y < SETUP.INLINE_LIMIT; y++) {
        const sx = SETUP.START_X + x * SETUP.CUBE_WIDTH;
        const sy = SETUP.START_Y + y * SETUP.CUBE_HEIGHT;
        const color = Phaser.Math.Between(0, 4);
        const id = Phaser.Utils.String.UUID();
        this.grid[x][y] = { x, y, sx, sy, color, id, isEmpty: false };
      }
    }
    this.renderGrid();
    this.getPossibleMoves();
  }

  getConnected(x, y) {
    if (!this.logic.isInGrid(x, y, this.grid) || this.grid[x][y].isEmpty) return null;
    let currentCube = this.grid[x][y];
    //check if neighbour cube is the same color
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
    for (let x = 0; x < SETUP.INLINE_LIMIT - 1; x++) {
      for (let y = 0; y < SETUP.INLINE_LIMIT - 1; y++) {
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
      for (let i = 0; i < SETUP.INLINE_LIMIT; i++) {
        item[i].y = item.indexOf(item[i]);
        item[i].sy = SETUP.START_Y + SETUP.CUBE_HEIGHT * item[i].y;
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
      for (let i = 0; i < SETUP.INLINE_LIMIT; i++) {
        if (item[i].isEmpty) {
          const color = Phaser.Math.Between(0, 4);
          item[i].isEmpty = false;
          item[i].sprite.setFrame(SETUP.FRAMES[color]);
          item[i].color = color;
        }
      }
    });
  }

  clickHandler(block) {
    const score = this.registry.get('score');
    const moves = this.registry.get('moves');

    this.getPossibleMoves();
    this.chosenColor = block.gridData.color;
    this.connectedItems(block.gridData.x, block.gridData.y);
    if (this.connected.length > 1) {
      let deleted = 0;
      this.registry.set('score', this.logic.addScore(this.connected, score));
      this.registry.set('moves', moves - 1);
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
    const score = this.registry.get('score');

    if (score > this.highscore) {
      this.registry.set('highscore', score);
    }
    this.camera.shake(1000, 0.04, false, this.cameraFadeOut);
  }

  levelChange() {
    const level = this.registry.get('level');
    const goal = this.registry.get('goal');
    this.registry.set('goal', Math.ceil(goal * 1.5));
    this.registry.set('level', level + 1);
    this.registry.set('score', SETUP.SCORE);
    this.registry.set('moves', SETUP.MOVES);
  }

  onGameWin() {
    this.sfx.emitt();
    this.levelChange();
  }

  updateData(parent, key, data) {
    const score = this.registry.get('score');
    const goal = this.registry.get('goal');

    if (key === 'moves') {
      this.movesText.setText(data < 10 ? `0${data}` : data);
      if ((data === 0 && score < goal) || this.possibleMoves.length === 0) this.onGameLoose();
      if (score >= goal) this.onGameWin();
    }

    if (key === 'score') {
      let dynemicWidth = 420 * (data / goal);
      this.scoreText.setText(`${data} / ${goal}`);
      this.rectBar.setSize(dynemicWidth < 420 ? dynemicWidth : 420, 30);
      this.progressBar.fillRectShape(this.rectBar);
    }

    if (key === 'highscore') {
      this.highscoreText.setText(data);
      localStorage.setItem('highscore', data);
      this.registry.set('new', true);
    }

    if (key === 'level') {
      this.levelText.setText(data);
      this.progressBar.clear();
    }
  }
}
