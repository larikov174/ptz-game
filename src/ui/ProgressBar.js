import Phaser from 'phaser';
import CONST from '../utils/constants';

export default class ProgressBar extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, fillColor) {
    super(scene, x, y, width, height, fillColor);
  }

  redraw(width) {
    const { BAR_WIDTH } = CONST.P_BAR;
    this.width = width < BAR_WIDTH ? width : BAR_WIDTH;
  }
}
