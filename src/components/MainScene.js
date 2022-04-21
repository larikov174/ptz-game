import Phaser from 'phaser';
import GameLogic from './GameLogic';
import SFX from '../ui/SFX';
import ProgressBar from '../ui/ProgressBar';
import LabelCreator from '../ui/LabelCreator';
import FONT_PROPS from '../ui/FontProps';
import CONST from '../utils/constants';

const { FRAMES, HIGHSCORE, SCORE, GOAL, MOVES, LEVEL, CUBE_HEIGHT, CUBE_WIDTH } = CONST;
const { BAR_WIDTH, BAR_HEIGHT, COLOR_NAVY, COLOR_GREEN } = CONST.P_BAR;
const { FAMILY, FILL, SIZE_XL, SIZE_M } = FONT_PROPS;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  init() {
    this.grid = [];
    this.connected = [];
    this.possibleMoves = [];
    this.highscore = localStorage.highscore ? JSON.parse(localStorage.highscore) : HIGHSCORE;
    this.camera = this.cameras.add();
  }

  preload() {
    this.cameras.main.fadeIn(250);
  }

  create() {
    this.logic = new GameLogic(this.grid, this.connected, this.possibleMoves, this.clickHandler, this);
    this.sfx = new SFX(this.add.particles('sprites'), FRAMES);

    this.progressOverlay = this.createBar(BAR_WIDTH, COLOR_NAVY);
    this.progressBar = this.createBar(0, COLOR_GREEN);

    this.scoreLabel = this.createLabel(0, 0, SCORE, SIZE_M);
    this.goalLabel = this.createLabel(0, 0, GOAL, SIZE_M);
    this.movesLabel = this.createLabel(0, 0, MOVES, SIZE_XL);
    this.highscoreLabel = this.createLabel(0, 0, this.highscore, SIZE_M);
    this.levelLabel = this.createLabel(0, 0, LEVEL, SIZE_M);
    this.slash = this.createLabel(0, 0, '/', SIZE_M);

    this.createUI();
    this.logic.createGrid();

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
    const bar = new ProgressBar(this, 0, 0, width, BAR_HEIGHT, color);
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

  clickHandler(block) {
    const chosenColor = block.gridData.color;
    this.logic.getPossibleMoves();
    this.logic.findConnected(block.gridData.x, block.gridData.y, chosenColor);
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
            this.logic.setEmpty(cube.x, cube.y);
            if (deleted === 0) {
              this.logic.handleEmptys(this.tweens);
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
    const dynemicWidth = BAR_WIDTH * (score / goal);

    if (key === 'moves') {
      this.progressBar.redraw(dynemicWidth);
      if (moves === 0 || this.possibleMoves.length === 0) this.onGameLoose();
      if (score >= goal) this.onGameWin();
    }

    if (key === 'level') {
      this.progressBar.redraw(dynemicWidth);
    }
  }
}
