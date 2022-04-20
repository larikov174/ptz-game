import LabelCreator from '../ui/LabelCreator';
import FONT_PROPS from '../ui/FontProps';
import CONST from '../utils/constants';
import sprites from '../assets/sprites.png';
import json from '../assets/sprites.json';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.atlas('sprites', sprites, json);
  }

  createLabel(x, y, value, size) {
    const { FAMILY, FILL } = FONT_PROPS;
    const style = { fontSize: `${size}px`, fill: FILL, fontFamily: FAMILY };
    const label = new LabelCreator(this, x, y, value, style);
    this.add.existing(label);
    label.depth = 3;
    return label;
  }

  create() {
    const { MAIN_TITLE, BEGIN_TEXT } = CONST.TEXT;
    const { SIZE_L, SIZE_S } = FONT_PROPS.SIZE;
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;
    const title = this.createLabel(0, 0, MAIN_TITLE, SIZE_L);
    const text = this.createLabel(0, 0, BEGIN_TEXT, SIZE_S);
    const cubeR = this.add.image(0, 0, 'sprites', 'red').setScale(1.5);
    const cubeB = this.add.image(0, 0, 'sprites', 'blue').setScale(1.5);
    const cubeG = this.add.image(0, 0, 'sprites', 'green').setScale(2.5);

    Phaser.Display.Align.In.TopCenter(title, this.add.zone(width / 2, height - 220, width, height));
    Phaser.Display.Align.In.Center(cubeR, this.add.zone(width / 2 - 115, height / 2, width, height));
    Phaser.Display.Align.In.Center(cubeB, this.add.zone(width / 2 + 115, height / 2, width, height));
    Phaser.Display.Align.In.Center(cubeG, this.add.zone(width / 2, height / 2, width, height));
    Phaser.Display.Align.In.BottomCenter(text, this.add.zone(width / 2, height - 620, width, height));

    this.input.once('pointerdown', () => {
      this.scene.start('MainScene');
    });
  }
}
