import LabelCreator from '../ui/LabelCreator';
import FONT_PROPS from '../ui/FontProps';
import CONST from '../utils/constants';
import sprites from '../assets/sprites.png';
import json from '../assets/sprites.json';

const { GAME_WIDTH, GAME_HEIGHT, COLOR_PURPLE } = CONST;

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.atlas('sprites', sprites, json);
  }

  createLabel(x, y, value, size) {
    const { FAMILY } = FONT_PROPS;
    const style = { fontSize: `${size}px`, fill: COLOR_PURPLE, fontFamily: FAMILY };
    const label = new LabelCreator(this, x, y, value, style);
    this.add.existing(label);
    return label;
  }

  create() {
    const { BEGIN_TEXT } = CONST.TEXT;
    const { SIZE_S } = FONT_PROPS;
    const screenCenter = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT);
    const text = this.createLabel(0, 0, BEGIN_TEXT, SIZE_S);
    const image = this.add.image(0, 0, 'sprites', 'FRONT_COVER');

    Phaser.Display.Align.In.QuickSet(image, screenCenter, 6, 0, 0);
    Phaser.Display.Align.In.QuickSet(text, screenCenter, 6, 0, 250);

    this.input.once('pointerdown', () => {
      this.scene.start('MainScene');
    });
  }
}
