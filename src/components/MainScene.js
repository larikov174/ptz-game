import Phaser from 'phaser';
import GameLogic from './GameLogic';
import SFX from '../ui/SFX';
import ProgressBar from '../ui/ProgressBar';
import LabelCreator from '../ui/LabelCreator';
import CONST from '../utils/constants';

const { HIGHSCORE, SCORE, GOAL, MOVES, LEVEL, CUBE_HEIGHT, START_Y, GAME_WIDTH, GAME_HEIGHT } = CONST;
const { BAR_WIDTH, BAR_HEIGHT, BAR_COLOR, OVERLAY_COLOR } = CONST.P_BAR;
const { FAMILY, SIZE_XL, SIZE_M, FC_WHITE } = CONST.FONT_PROPS;

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
    this.sfx = new SFX(this.add.particles('sprites'));

    this.createUI();
    this.logic.createGrid();

    this.registry.set('moves', this.movesLabel.get());
    this.registry.set('level', this.levelLabel.get());
    this.registry.set('new', false);
    this.registry.events.on('changedata', this.updateData, this);

    this.input.on('gameobjectdown', (pointer, gameObject) => gameObject.emit('clicked', gameObject), this);
    this.openModal.on('pointerdown', this.onModalOpen, this);
    this.closeModal.on('pointerdown', this.onModalClose, this);
    this.overlay.on('pointerdown', this.onModalClose, this);

    this.input.keyboard.on('keydown-ESC', this.onModalClose, this);
  }

  createLabel(x, y, value, size) {
    const style = { fontSize: `${size}px`, fill: FC_WHITE, fontFamily: FAMILY };
    const label = new LabelCreator(this, x, y, value, style);
    this.add.existing(label);
    label.depth = 1;
    return label;
  }

  createBar(width) {
    const bar = new ProgressBar(this, 0, 0, width, BAR_HEIGHT, BAR_COLOR);
    this.add.existing(bar);
    return bar;
  }

  createUI() {
    const screenCenter = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT);

    const field = this.add.image(0, 0, 'sprites', 'FIELD');
    const header = this.add.image(0, 0, 'sprites', 'HEADER');
    const scoreboard = this.add.image(0, 0, 'sprites', 'SCORE_BOARD');
    this.openModal = this.add.image(0, 0, 'sprites', 'BUTTON_RULES').setInteractive();
    this.modal = this.add.image(0, 0, 'sprites', 'MODAL');
    this.closeModal = this.add.image(0, 0, 'sprites', 'CLOSE_BUTTON').setInteractive();

    this.progressBar = this.createBar(0, BAR_COLOR);
    this.overlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, OVERLAY_COLOR).setInteractive();

    this.scoreLabel = this.createLabel(0, 0, SCORE, SIZE_M);
    this.goalLabel = this.createLabel(0, 0, GOAL, SIZE_M);
    this.movesLabel = this.createLabel(0, 0, MOVES, SIZE_XL);
    this.highscoreLabel = this.createLabel(0, 0, this.highscore, SIZE_M);
    this.levelLabel = this.createLabel(0, 0, LEVEL, SIZE_M);

    header.depth = -1;
    this.overlay.depth = 3;
    this.modal.depth = 4;
    this.modal.alpha = 0;
    this.closeModal.depth = 5;
    this.closeModal.alpha = 0;
    this.overlay.alpha = 0;

    Phaser.Display.Align.In.QuickSet(header, screenCenter, 1, 0, -15);
    Phaser.Display.Align.In.QuickSet(this.levelLabel, header, 4, -75, 20);
    Phaser.Display.Align.In.QuickSet(this.highscoreLabel, header, 8, -115, 20);
    Phaser.Display.Align.In.QuickSet(this.progressBar, header, 6, -210, 20);
    Phaser.Display.Align.In.QuickSet(scoreboard, screenCenter, 8, 0, 50);
    Phaser.Display.Align.In.QuickSet(this.movesLabel, scoreboard, 1, -5, -130);
    Phaser.Display.Align.In.QuickSet(this.scoreLabel, scoreboard, 6, 20, 77);
    Phaser.Display.Align.In.QuickSet(this.goalLabel, scoreboard, 6, 20, 137);
    Phaser.Display.Align.In.QuickSet(this.openModal, scoreboard, 11, 0, -20);
    Phaser.Display.Align.In.QuickSet(field, screenCenter, 4, 0, 50);
    Phaser.Display.Align.In.QuickSet(this.modal, field, 6, 0, 0);
    Phaser.Display.Align.In.QuickSet(this.closeModal, this.modal, 7, -15, -15);
    Phaser.Display.Align.In.QuickSet(this.overlay, screenCenter, 6, 0, 0);
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
          tweens: [{ alpha: 1 }, { y: START_Y - CUBE_HEIGHT }],
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

  onModalOpen() {
    this.modal.alpha = 1;
    this.closeModal.alpha = 1;
    this.overlay.alpha = 0.5;
  }

  onModalClose() {
    this.modal.alpha = 0;
    this.closeModal.alpha = 0;
    this.overlay.alpha = 0;
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
    this.movesLabel.set(MOVES);
    this.levelLabel.add(LEVEL);
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
      if ((moves === 0 && score < goal) || this.possibleMoves.length === 0) this.onGameLoose();
      if (score >= goal) this.onGameWin();
    }

    if (key === 'level') {
      this.progressBar.redraw(dynemicWidth);
    }
  }
}
