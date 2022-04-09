import FONT_PROPS from '../utils/utils';
import sprites from '../assets/sprites.png';
import json from '../assets/sprites.json';


export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.atlas('sprites', sprites, json);
  }

  create() {
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;
    const cubeR = this.add.image(0, 0, 'sprites', 'red').setScale(1.5);
    const cubeB = this.add.image(0, 0, 'sprites', 'blue').setScale(1.5);
    const cubeG = this.add.image(0, 0, 'sprites', 'green').setScale(2.5);
    const title = this.make.text(FONT_PROPS('КуБиКи', 48));
    const text = this.make.text(FONT_PROPS('Нажмите, чтобы начать игру'));

    Phaser.Display.Align.In.TopCenter(title,
      this.add.zone(
        width / 2,
        height - 220,
        width, height
      ));
    Phaser.Display.Align.In.Center(cubeR,
      this.add.zone(
        width / 2 - 115,
        height / 2,
        width, height
      ));
    Phaser.Display.Align.In.Center(cubeB,
      this.add.zone(
        width / 2 + 115,
        height / 2,
        width, height
      ));
    Phaser.Display.Align.In.Center(cubeG,
      this.add.zone(
        width / 2,
        height / 2,
        width, height
      ));
    Phaser.Display.Align.In.BottomCenter(text,
      this.add.zone(
        width / 2,
        height - 620,
        width, height
      ));

    this.input.once('pointerdown', () => {
        this.scene.start('MainScene');
    });
  }
}