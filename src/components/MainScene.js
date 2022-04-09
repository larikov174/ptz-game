import Phaser from 'phaser';
import SFX from './SFX';
import FONT_PROPS from '../utils/utils';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  init() {
    this.startX = 45;
    this.startY = 230;
    this.endX = 590;
    this.endY = 690;
    this.gameWidth = this.sys.game.config.width;
    this.gameHeigth = this.sys.game.config.height;
    this.sceneZone = this.add.zone(this.gameWidth / 2, this.gameHeigth / 2, this.gameWidth, this.gameHeigth);
    this.frames = ['blue', 'purple', 'red', 'yellow', 'green'];
    this.grid = [];
    this.connected = [];
    this.chosenColor = null;
    this.highscore = localStorage.highscore ? JSON.parse(localStorage.highscore) : 0;
    this.score = 0;
    this.goal = 5;
    this.moves = 10;
    this.possibleMoves = [];
    this.level = 1;
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
    this.sfx = new SFX({
      sprites: this.add.particles('sprites')
    })

    this.createUI();
    this.createGrid();
    this.registry.set('score', this.score);
    this.registry.set('moves', this.moves);
    this.registry.set('highscore', this.highscore);
    this.registry.set('level', this.level);
    this.registry.events.on('changedata', this.updateData, this);

    // emmit click event on each cube
    this.input.on('gameobjectdown', (pointer, gameObject) => gameObject.emit('clicked', gameObject), this);
  }


}
