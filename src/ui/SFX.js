import CONST from '../utils/constants';

const { FRAMES } = CONST;

export default class SFX {
  constructor(sprites) {
    this._emitters = {};
    this._particles = sprites;
  }

  _createEmitter(color) {
    this._emitters[color] = this._particles.createEmitter({
      frame: color,
      lifespan: 1200,
      speed: { min: 200, max: 400 },
      alpha: { start: 1, end: 0 },
      scale: { start: 0.25, end: 0 },
      rotate: { start: 0, end: 460, ease: 'Power2' },
      blendMode: 'ADD',
      on: false
    });
  }

  _callEmitter() {
    for (let i = 0; i < FRAMES.length; i++) {
      this._createEmitter(FRAMES[i]);
    }
  }

  emitt() {
    const color = Phaser.Math.Between(0, 4);
    this._callEmitter();
    this._emitters[FRAMES[color]].explode(26, 90, 100);
  }
}
