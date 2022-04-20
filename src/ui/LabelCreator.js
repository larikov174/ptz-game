import Phaser from 'phaser';

const format = (value) => `${value < 10 ? 0 : ''}${value}`;

export default class LabelCreator extends Phaser.GameObjects.Text {
  constructor(scene, x, y, value, style) {
    super(scene, x, y, format(value), style);
    this.value = value;
  }

  set(value) {
    this.value = value;
    this._updateScoreText();
  }

  add(points) {
    this.set(this.value + points);
  }

  reduce(move) {
    this.set(this.value - move);
  }

  reset() {
    this.set(0);
  }

  get() {
    return this.value;
  }

  _updateScoreText() {
    this.setText(format(this.value));
  }
}
