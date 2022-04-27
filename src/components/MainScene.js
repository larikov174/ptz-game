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
    this.sfx = new SFX(this.add.particles('sprites_2'));

    this.createUI();
    this.logic.createGrid();

    this.registry.set('moves', this.timerLabel.get());
    this.registry.set('new', false);
    this.registry.events.on('changedata', this.updateData, this);

    this.input.on('gameobjectdown', (pointer, gameObject) => gameObject.emit('clicked', gameObject), this);
    this.openModal.on('pointerdown', this.onModalOpen, this);
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

    const field = this.add.image(0, 0, 'sprites_1', 'FIELD').setScale(0.5);
    const header = this.add.image(0, 0, 'sprites_3', 'HEADER').setScale(0.5);
    this.openModal = this.add.image(0, 0, 'sprites_2', 'BUTTON_RULES').setScale(0.5).setInteractive();
    this.modal = this.add.image(0, 0, 'sprites_2', 'MODAL').setScale(0.5);

    this.overlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, OVERLAY_COLOR).setInteractive();
    this.scoreLabel = this.createLabel(0, 0, SCORE, SIZE_M);
    this.timerLabel = this.createLabel(0, 0, MOVES, SIZE_XL);
    this.highscoreLabel = this.createLabel(0, 0, this.highscore, SIZE_M);

    this.overlay.depth = 2;
    this.overlay.alpha = 0;
    this.modal.depth = 3;
    this.modal.alpha = 0;

    Phaser.Display.Bounds.CenterOn(header, GAME_WIDTH / 2, 50);
    Phaser.Display.Align.In.QuickSet(field, header, 1, 0, 300);
    Phaser.Display.Bounds.SetLeft(this.highscoreLabel, 880);
    this.highscoreLabel.y = 60
    Phaser.Display.Bounds.SetLeft(this.scoreLabel, 880);
    this.scoreLabel.y = 17;
    Phaser.Display.Bounds.SetLeft(this.timerLabel, 452);
    this.timerLabel.y = 10
    Phaser.Display.Align.In.QuickSet(this.overlay, screenCenter, 6, 0, 0);
    Phaser.Display.Align.In.QuickSet(this.openModal, header, 6, -400, 10);
    Phaser.Display.Align.In.QuickSet(this.modal, field, 6, 0, 0);
  }

  clickHandler(block) {
    const chosenColor = block.gridData.color;
    this.logic.getPossibleMoves();
    this.logic.findConnected(block.gridData.x, block.gridData.y, chosenColor);
    if (this.connected.length > 1) {
      let deleted = 0;
      this.scoreLabel.addScore(this.connected.length);
      this.timerLabel.reduce(1);
      this.registry.set('moves', this.timerLabel.get());
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
    this.tweens.add({
      targets: this.overlay,
      alpha: 0.5,
      ease: 'Power1',
      duration: 250,
      delay: 0,
    });
    this.tweens.add({
      targets: this.modal,
      alpha: 1,
      ease: 'Power1',
      duration: 250,
      delay: 50,
    });
  }

  onModalClose() {
    this.tweens.add({
      targets: this.overlay,
      alpha: 0,
      ease: 'Power1',
      duration: 250,
      delay: 50,
    });
    this.tweens.add({
      targets: this.modal,
      alpha: 0,
      ease: 'Power1',
      duration: 250,
      delay: 0,
    });
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
    this.timerLabel.set(MOVES);
    this.levelLabel.add(LEVEL);
    this.registry.set('level', this.levelLabel.get());
  }

  onGameWin() {
    this.sfx.emitt();
    this.levelChange();
  }

  textAlignHanlder(textElement, xPos) {
    console.log(xPos - textElement.width);
    return (textElement.x = xPos + textElement.width);
  }

  updateData(parent, key, data) {
    const timer = this.timerLabel.get();
    const score = this.scoreLabel.get();

    if (key === 'moves') {
      // this.textAlignHanlder(this.timerLabel, 545);
      // this.textAlignHanlder(this.scoreLabel, 850);
      if (timer === 0 || this.possibleMoves.length === 0) this.onGameLoose();
      // if (score >= goal) this.onGameWin();
    }
  }
}
