import Phaser from 'phaser';

const format = (value) => `${value < 10 ? 0 : ''}${value}`;

export default class LabelCreator extends Phaser.GameObjects.Text {
  constructor(scene, x, y, value, style) {
    super(scene, x, y, format(value), style);
    this.value = value;
  }

  set(value) {
    this.value = value > 0 ? value : 0;
    this._updateScoreText();
  }

  add(value) {
    this.set(this.value + value);
  }

  addScore(points) {
    switch (points) {
      case 2:
        this.set(this.value + points);
        break;
      case 3:
        this.set(this.value + Math.ceil(points * 1.5));
        break;
      case 4:
        this.set(this.value + Math.ceil(points * 2));
        break;
      default:
        this.set(this.value + Math.ceil(points * 3));
        break;
    }
  }

  reduce(move) {
    this.set(this.value - move);
  }

  get() {
    return this.value;
  }

  _updateScoreText() {
    this.setText(format(this.value));
  }
}
