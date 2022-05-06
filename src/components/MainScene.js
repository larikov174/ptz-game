import Phaser from 'phaser';
import GameLogic from './GameLogic';
import SFX from '../ui/SFX';
import LabelCreator from '../ui/LabelCreator';
import CONST from '../utils/constants';

const {
  SCORE,
  TIME,
  CUBE_HEIGHT,
  START_Y,
  GAME_WIDTH
} = CONST;
const {
  FAMILY,
  SIZE_XL,
  FC_WHITE
} = CONST.FONT_PROPS;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  init() {
    this.grid = [];
    this.connected = [];
    this.possibleMoves = [];
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

    this.registry.set('time', this.timerLabel.get());
    this.registry.set('new', false);
    this.registry.events.on('changedata', this.updateData, this);

    this.input.on('gameobjectdown', (pointer, gameObject) => gameObject.emit('clicked', gameObject), this);
    this.backHome.on('pointerdown', this.goBackHome, this);

    this.backHome.on(
      'pointerover',
      () => this.backHome.setTint(0xf0af1d),
      this,
    );

    this.backHome.on(
      'pointerout',
      () => this.backHome.clearTint(),
      this,
    );

    this.timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onTimeEvent,
      callbackScope: this,
      loop: true,
    });
  }

  createLabel(x, y, value, size) {
    const style = {
      fontSize: `${size}px`,
      fill: FC_WHITE,
      fontFamily: FAMILY,
    };
    const label = new LabelCreator(this, x, y, value, style);
    this.add.existing(label);
    label.depth = 1;
    return label;
  }

  createUI() {
    const field = this.add.image(0, 0, 'sprites_1', 'FIELD').setScale(0.5);
    const header = this.add.image(0, 0, 'sprites_3', 'HEADER').setScale(0.5);
    this.backHome = this.add.image(0, 0, 'sprites_2', 'BUTTON_RULES').setScale(0.5).setInteractive();

    this.scoreLabel = this.createLabel(0, 17, SCORE, SIZE_XL);
    this.timerLabel = this.createLabel(0, 10, TIME, SIZE_XL);

    Phaser.Display.Bounds.CenterOn(header, GAME_WIDTH / 2, 50);
    Phaser.Display.Align.In.QuickSet(field, header, 1, 0, 300);
    Phaser.Display.Align.In.QuickSet(this.scoreLabel, header, 6, 375, 4);
    Phaser.Display.Bounds.SetLeft(this.timerLabel, 452);
    Phaser.Display.Align.In.QuickSet(this.backHome, header, 6, -400, 10);
  }

  onTimeEvent() {
    const game = document.querySelector('.game');
    if (!game.classList.contains('idle')) {
      this.timerLabel.reduce(1);
      this.registry.set('time', this.timerLabel.get());
    }
  }

  clickHandler(block) {
    const chosenColor = block.gridData.color;
    this.logic.getPossibleMoves();
    this.logic.findConnected(block.gridData.x, block.gridData.y, chosenColor);
    if (this.connected.length > 1) {
      let deleted = 0;
      this.scoreLabel.addScore(this.connected.length);
      this.connected.forEach((cube) => {
        deleted += 1;
        this.tweens.timeline({
          targets: cube.sprite,
          tweens: [{
              alpha: 1,
            },
            {
              y: START_Y - CUBE_HEIGHT,
            },
          ],
          duration: 0,
          callbackScope: this,
          onComplete: () => {
            deleted -= 1;
            this.logic.setEmpty(cube.x, cube.y);
            if (deleted === 0) {
              this.logic.handleEmptys(this.tweens);
            }
          },
        });
      });
    }
  }

  goBackHome() {
    this.scene.start('Preloader');

    const header = document.querySelector('.header');
    const mainBlock = document.querySelector('.main');
    const introSection = document.querySelector('.main__intro');
    const resultSection = document.querySelector('.main__results');
    const infoBlock = document.querySelector('.info');
    const game = document.querySelector('.game');
    const footer = document.querySelector('.footer');

    game.classList.add('idle');
    header.classList.remove('idle');
    mainBlock.classList.remove('idle');
    infoBlock.classList.remove('idle');
    footer.classList.remove('idle');
    introSection.classList.remove('idle');
    resultSection.classList.add('idle');
  }

  // eslint-disable-next-line
  gameOver(cam = null, progress = 0) {
    if (progress === 1) {
      this.scene.start('Preloader');

      const header = document.querySelector('.header');
      const mainBlock = document.querySelector('.main');
      const infoBlock = document.querySelector('.info');
      const game = document.querySelector('.game');
      const footer = document.querySelector('.footer');
      const resultBlock = document.querySelector('#resultToShow');
      const scrollUpButton = document.querySelector('.info__button_back');


      resultBlock.innerHTML = this.scoreLabel.get();

      game.classList.add('idle');
      scrollUpButton.classList.add('idle');
      header.classList.remove('idle');
      mainBlock.classList.remove('idle');
      infoBlock.classList.remove('idle');
      footer.classList.remove('idle');
    }
  }

  // eslint-disable-next-line
  cameraFadeOut(cam = null, progress = 0) {
    if (progress === 1) this.camera.fade(1000, 0, 0, 0, false, this.gameOver);
  }

  onGameLoose() {
    this.camera.shake(1000, 0.04, false, this.cameraFadeOut);
  }

  updateData(parent, key) {
    if (key === 'time') {
      const timer = this.timerLabel.get();
      if (timer === 0 || this.possibleMoves.length === 0) this.onGameLoose();
    }
  }
}
