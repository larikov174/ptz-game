import Phaser from 'phaser';

export default class ProgressBar extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, fillColor) {
    super(scene, x, y, width, height, fillColor);
  }

  redraw(width) {
    this.width = width < 420 ? width : 420;
  }
}
