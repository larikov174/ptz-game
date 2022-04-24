import Phaser from 'phaser';
import LabelCreator from '../ui/LabelCreator';
import FONT_PROPS from '../ui/FontProps';
import CONST from '../utils/constants';

const { GAME_WIDTH, GAME_HEIGHT, CUBE_HEIGHT, CUBE_WIDTH, FRAMES } = CONST;

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  preload() {
    this.cameras.main.fadeIn(250);
  }

  createLabel(x, y, value, size) {
    const { FAMILY, FILL } = FONT_PROPS;
    const style = { fontSize: `${size}px`, fill: FILL, fontFamily: FAMILY };
    const label = new LabelCreator(this, x, y, value, style);
    this.add.existing(label);
    label.depth = 3;
    return label;
  }

  createCubefall() {
    this.arr = [];
    for (let i = 0; i < 20; i++) {
      const color = Phaser.Math.Between(0, FRAMES.length - 1);
      const sx = Phaser.Math.Between(CUBE_WIDTH, GAME_WIDTH);
      const sy = Phaser.Math.Between(0, GAME_HEIGHT);
      let block = this.add.sprite(sx, sy, 'sprites', CONST.FRAMES[color]).setScale(0.5).setAlpha(0.7);
      this.arr[i] = block;
    }
  }

  create() {
    this.createCubefall();
    const { AGAIN, CHEERUP, NEW_RECORD, NEW_SCORE, BEST_SCORE } = CONST.TEXT;
    const { SIZE_L, SIZE_S } = FONT_PROPS;
    const screenCenter = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT);
    const content = () => {
      if (this.registry.get('new'))
        return {
          text1: NEW_RECORD,
          text2: `${NEW_SCORE} ${localStorage.highscore}`,
        };
      else
        return {
          text1: CHEERUP,
          text2: `${BEST_SCORE} ${localStorage.highscore}`,
        };
    };

    const textAgain = this.createLabel(0, 0, AGAIN, SIZE_S);
    const title = this.createLabel(0, 0, content().text1, SIZE_L);
    const textScore = this.createLabel(0, 0, content().text2, SIZE_S);

    Phaser.Display.Align.In.QuickSet(title, screenCenter, 6, 0, 0);
    Phaser.Display.Align.In.QuickSet(textScore, screenCenter, 6, 0, 50);
    Phaser.Display.Align.In.QuickSet(textAgain, screenCenter, 6, 0, 300);

    this.input.once('pointerdown', () => {
      this.scene.start('MainScene');
    });
  }

  update() {
    this.arr.forEach((block) => {
      block.y += 0.5;
      if (block.y > GAME_HEIGHT + CUBE_HEIGHT) block.y = -100;
    });
  }
}
