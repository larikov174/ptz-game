import Phaser from 'phaser';
import FONT_PROPS from '../utils/utils';
import SETUP from '../utils/setup';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  preload() {
    this.cameras.main.fadeIn(250);
  }

  create() {
    this.arr = [];
    for (let i = 0; i < 20; i++) {
      const color = Phaser.Math.Between(0, 4);
      const sx = Phaser.Math.Between(60, 990);
      const sy = Phaser.Math.Between(-950, 0);
      let block = this.add.sprite(sx, sy, 'sprites', SETUP.FRAMES[color]).setScale(0.5).setAlpha(0.7);
      this.arr[i] = block;
    }

    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;
    const textAgain = this.make.text(FONT_PROPS(SETUP.TEXT.AGAIN));
    const title = this.make.text(
      FONT_PROPS(this.registry.get('new') == true ? SETUP.TEXT.NEW_RECORD : SETUP.TEXT.CHEERUP, 48),
    );
    const textScore = this.make.text(
      FONT_PROPS(
        `${this.registry.get('new') == true ? SETUP.TEXT.NEW_SCORE : SETUP.TEXT.BEST_SCORE} ${localStorage.highscore}`,
      ),
    );

    Phaser.Display.Align.In.Center(title, this.add.zone(width / 2, height / 2, width, height));
    Phaser.Display.Align.In.Center(textScore, this.add.zone(width / 2, height / 2 + 50, width, height));
    Phaser.Display.Align.In.Center(textAgain, this.add.zone(width / 2, height / 2 + 300, width, height));

    this.input.once('pointerdown', () => {
      this.scene.start('MainScene');
    });
  }

  update() {
    this.arr.forEach((block) => {
      block.y += 0.7;
      if (block.y > 880) block.y = -100;
    });
  }
}
