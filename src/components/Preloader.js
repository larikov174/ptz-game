import LabelCreator from '../ui/LabelCreator';
import CONST from '../utils/constants';
import sprites_1 from '../assets/sprites_field.png';
import sprites_2 from '../assets/sprites_buttons.png';
import sprites_3 from '../assets/sprites_header.png';
import json_1 from '../assets/sprites_field.json';
import json_2 from '../assets/sprites_buttons.json';
import json_3 from '../assets/sprites_header.json';


export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.atlas('sprites_1', sprites_1, json_1);
    this.load.atlas('sprites_2', sprites_2, json_2);
    this.load.atlas('sprites_3', sprites_3, json_3);
  }

  createLabel(x, y, value) {
    const { FAMILY, FC_PURPLE, SIZE_S } = CONST.FONT_PROPS;
    const style = { fontSize: `${SIZE_S}px`, fill: FC_PURPLE, fontFamily: FAMILY };
    const label = new LabelCreator(this, x, y, value, style);
    this.add.existing(label);
    return label;
  }

  create() {
    const { GAME_WIDTH, GAME_HEIGHT } = CONST;
    const { BEGIN_TEXT } = CONST.TEXT;
    const screenCenter = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT);
    const text = this.createLabel(0, 0, BEGIN_TEXT);
    const image = this.add.image(0, 0, 'sprites_3', 'FRONT_COVER').setScale(0.5);

    Phaser.Display.Align.In.QuickSet(image, screenCenter, 6, -2, 0);
    Phaser.Display.Align.In.QuickSet(text, screenCenter, 6, 0, 250);

    this.input.once('pointerdown', () => {
      this.scene.start('MainScene');
    });
  }
}
