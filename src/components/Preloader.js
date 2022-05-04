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
    this.scene.start('MainScene');
  }
}
