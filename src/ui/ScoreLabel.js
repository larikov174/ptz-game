import Phaser from 'phaser';
import FONT_PROPS from '../utils/utils';

const formatScore = (score, goal) => `${score} / ${goal}`;

export default class ScoreLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, score, goal) {
    super(scene, x, y, formatScore(score, goal));
    this.score = score;
  }

  setScore(score) {
    this.score = score;
    this.updateScoreText();
  }

  add(points) {
    this.setScore(this.score + points);
  }

  updateScoreText() {
    this.setText(FONT_PROPS(formatScore(this.score), 32));
  }
}
