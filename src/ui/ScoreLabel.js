import Phaser from 'phaser';

const formatScore = (score) => `${score < 10 ? 0 : ''}${score}`;

export default class ScoreLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, score, style) {
    super(scene, x, y, formatScore(score), style);
    this.score = score;
  }

  setScore(score) {
    this.score = score;
    this.updateScoreText();
  }

  add(points) {
    this.setScore(this.score + points);
  }

  reduce(move) {
    this.setScore(this.score - move);
  }

  reset() {
    this.setScore(0);
  }

  value() {
    return this.score;
  }

  updateScoreText() {
    this.setText(formatScore(this.score));
  }
}
