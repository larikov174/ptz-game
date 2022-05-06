import { Scene } from 'phaser';
import LabelCreator from '../ui/LabelCreator';
import CONST from '../utils/constants';
import spritesField from '../assets/sprites_field.png';
import spritesButtons from '../assets/sprites_buttons.png';
import spritesHeader from '../assets/sprites_header.png';
import jsonField from '../assets/sprites_field.json';
import jsonButtons from '../assets/sprites_buttons.json';
import jsonHeader from '../assets/sprites_header.json';

export default class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.atlas('spritesField', spritesField, jsonField);
    this.load.atlas('spritesButtons', spritesButtons, jsonButtons);
    this.load.atlas('spritesHeader', spritesHeader, jsonHeader);
  }

  createLabel(x, y, value) {
    const {
      FAMILY,
      FC_PURPLE,
      SIZE_S
    } = CONST.FONT_PROPS;
    const style = {
      fontSize: `${SIZE_S}px`,
      fill: FC_PURPLE,
      fontFamily: FAMILY
    };
    const label = new LabelCreator(this, x, y, value, style);
    this.add.existing(label);
    return label;
  }

  create() {
    this.scene.start('MainScene');
  }
}
